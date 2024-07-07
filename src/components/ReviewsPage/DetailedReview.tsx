import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header/Header";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Container,
  ScrollArea,
  Image,
  Center,
  TextInput,
  Space,
  Group,
  Rating,
} from "@mantine/core";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";

interface uploadFile {
  objectKey: string;
  size: Number;
}

interface review {
  fileList: [
    {
      id: string;
      review: string;
      sizeBytes: Number;
      contentType: string;
      originalFileName: string;
      s3Key: string;
      mediaFileStatus: string;
    }
  ];
  fileLocation: {
    additionalProp1: Number;
  };
  userDescription: string;
  rating: Number;
}

export function DetailedReview() {
  const [value, setValue] = useState("");

  //fonts
  const Font = Quill.import("formats/font");

  const formats = [
    "size",
    "font",
    "color",
    "background",
    "align",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const quilRef = useRef(null);
  const [ratingValue, setRatingValue] = useState(null);

  const [completeUploadState, setCompleteUploadState] = useState<uploadFile>({
    objectKey: "",
    size: 0,
  });

  {
    /*  cloudinary backup
  async function cloudinaryImageUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData, 
      }
    ).then((res) => res.json());
    const url = res.url;

    console.log(res);

    return url;
  }
*/
  }

  const authToken = sessionStorage.getItem(`authToken`);

  const getPresignedURL = useCallback(async (s3Body) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/media-file/upload-file-small`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(s3Body),
      }
    ).then((res) => res.json());
    return res;
  }, []);

  const getObjectKey = (url) => {
    const parsed_url = new URL(url);
    var url_pathname = parsed_url.pathname; //remove the trailing aslash
    url_pathname = url_pathname.substring(1).trim();

    return url_pathname;
  };

  const uploadAmazonS3 = useCallback(async (file, s3Body) => {
    const presigned_url = await getPresignedURL(s3Body);
    const res = await fetch(`${presigned_url}`, {
      method: "PUT",

      body: file,
      headers: {
        "Content-Type": `${file.type}`,
      },
    });
    console.log(res, "success in adding to s3 server!s");
    const objectKey = getObjectKey(res.url);
    return objectKey;
  }, []);

  const getFroms3 = async (objectKey) => {
    const get_url = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/media-file/get-file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: objectKey,
      }
    ).then((res) => res.json());
    return get_url; //this is the s3 url we will get
  };

  //COMPLETE ONLY!! WHEN WE FORM SUBMIT THEN THIS IS CALLED!
  const completeUpload = async (uploadState) => {
    await fetch(
      `${import.meta.env.VITE_APP_API_URL}/media-file/complete-upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(uploadState),
      }
    ).then((res) => console.log("completed upload"));
  };

  //can't use this as no delete properties for reactquill
  const deleteImage = async (objectKey) => {
    return await fetch(
      `${import.meta.env.VITE_APP_API_URL}/media-file/delete-file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: objectKey,
      }
    ).then((res) => res.json());
  };

  //^
  const abortUpload = async (uploadState) => {
    return await fetch(
      `${import.meta.env.VITE_APP_API_URL}/media-file/abort-upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(uploadState),
      }
    ).then((res) => console.log("aborted upload"));
  };

  //files not in the html url should not be uploaded during form submission
  const [allObjKeys, setAllObjKeys] = useState([]);

  //////////////////////makeshift scheduleID
  const scheduleId = "3eb1f5e8-ed0b-49ec-b709-662f0ed104c6"; //we will append this to our url when creating review instead

  const queryClient = useQueryClient();

  //solution -> just store
  const imageHandler = useCallback(() => {
    const quilEditor = quilRef.current.getEditor();
    const quilSelection = quilEditor.getSelection(); //gets the current location users curser is at
    const imageInput = document.createElement("input"); //image input
    imageInput.setAttribute("type", "file"); //file types only
    imageInput.setAttribute("accept", "image/*"); //accepts images
    imageInput.click(); //mimicks click

    imageInput.onchange = async () => {
      //for file upload//
      if (imageInput !== null && imageInput.files !== null) {
        const file = imageInput.files[0];
        const fileSize = file.size;
        const fileName = file.name;
        const contentLocation = quilSelection.index;
        const s3Body = {
          scheduleId: scheduleId,
          fileSize: fileSize,
          originalFileName: fileName,
          contentLocation: contentLocation,
        };
        //getPresignedURL(s3Body);
        const objKey = await uploadAmazonS3(file, s3Body); //uploads to cloud
        const s3_url = await getFroms3(objKey); //get file after we upload
        quilEditor.insertEmbed(quilSelection, "image", s3_url); //encoded differently in HTML so we need to make edits
        setAllObjKeys((p) => [...p, objKey]);
        console.log("s3 url is", s3_url);
        console.log("obj key is", objKey);
        //completeUpload({ objectKey: s3_url, size: fileSize }); -> don't complete yet until we do form submission
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        handlers: {
          image: imageHandler,
        },
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          [{ size: ["small", "normal", "large", "huge"] }],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      },
    }),
    []
  );

  //do url extraction from quil.ref --> and compare the links
  const uploadReview = async (fileList) => {
    const rating = ratingValue;
    const userDescription = quilRef.current.value; //stores it in html format
  };

  ///replace amp
  const replaceAmp = (url) => {
    const new_url = url.replace(/&amp;/g, "&");
    return new_url;
  };

  ///////////////////////////ALL URL of our possible obj keys --> this has no Amp itself////////////
  const getAllUrlsFromObjKeys = useQueries({
    queries: allObjKeys.map((objKey) => ({
      queryKey: [objKey],
      queryFn: async () => {
        return await getFroms3(objKey);
      },
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
      };
    },
  });

  const getAllInputSrc = () => {
    const htmlString = quilRef.current.value;
  };

  const problem =
    "https://nus-orbital-roamgram.s3.ap-southeast-2.amazonaws.com/uploads/d52df994-0c45-437f-bb32-5806409f405d/booking.png/image/png/3eb1f5e8-ed0b-49ec-b709-662f0ed104c6/633451c3b593fb89caaf818a0c721087?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Date=20240707T180859Z&amp;X-Amz-SignedHeaders=host&amp;X-Amz-Credential=AKIA4MTWIDUWB4UVOPQO%2F20240707%2Fap-southeast-2%2Fs3%2Faws4_request&amp;X-Amz-Expires=1800&amp;X-Amz-Signature=863116f61592cbd059a44150ccc21619d82ae46d70e205963f5024993e665fcf";
  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <Image src="/assets/Create Review.png" w="auto" mt={35} ml={360} />
        <Center>
          <Card withBorder w={1200} mt={20}>
            <ScrollArea h={650}>
              <Container fluid w={1100} h="auto">
                <Group>
                  <TextInput
                    id="review-location"
                    description="Location"
                    w={350}
                  />
                  <Rating
                    fractions={2}
                    pt={20}
                    value={ratingValue}
                    onChange={setRatingValue}
                  />
                </Group>
                <Space h={30} />
                <ReactQuill
                  placeholder="Write Review"
                  ref={quilRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={value}
                  onChange={setValue}
                />
              </Container>
            </ScrollArea>
          </Card>
        </Center>
        <Button
          mt={10}
          ml={1200}
          variant="outline"
          onClick={async () => {
            console.log(quilRef.current.value);
            console.log(ratingValue);
            console.log("allObjKeys", allObjKeys);
            console.log(getAllUrlsFromObjKeys);
            const item = new DOMParser();
            const n = item.parseFromString(quilRef.current.value, "text/html");
            const imgsArray = Array.from(n.getElementsByTagName("img")); // this is a shallow copy
            await imgsArray.map((items) => console.log(replaceAmp(items.src)));
          }}
        >
          Submit Review
        </Button>
        <Button
          onClick={() => {
            var dd = problem.replace(/&amp;/g, "&");
            console.log("replaced", dd);
          }}
        >
          Test Parser
        </Button>
      </body>
    </>
  );
}

export default DetailedReview;

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
    console.log("deleteObjKey", objectKey);
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
    )
      .then((res) => res.json())
      .catch((error) => console.log("Error Deleting"));
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
  const [allUploadStates, setAllUploadStates] = useState<uploadFile[]>([]);

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
        console.log("file_size", fileSize);
        const objKey = await uploadAmazonS3(file, s3Body); //uploads to cloud
        const s3_url = await getFroms3(objKey); //get file after we upload
        const uploadStateBody = {
          objectKey: objKey,
          size: fileSize,
        };
        quilEditor.insertEmbed(quilSelection, "image", s3_url); //encoded differently in HTML so we need to make edits
        setAllObjKeys((p) => [...p, objKey]);
        setAllUploadStates((p) => [...p, uploadStateBody]); //async
        console.log("s3 url is", s3_url);
        console.log("obj key is", objKey);
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

  const getAllInputSrc = (quilRef) => {
    const htmlString = quilRef.current.value;
    const newDomParser = new DOMParser().parseFromString(
      htmlString,
      "text/html"
    ); //parses into new document(seperate from our page)
    var imgsArray = Array.from(newDomParser.getElementsByTagName("img")); //gets all 'img' tags
    console.log("imgsArray before map", imgsArray);
    imgsArray = imgsArray.map((items) => {
      return replaceAmp(items.src);
    });

    return imgsArray;
  };

  const getAvailableObjKeys = (imgsArray) => {
    const availableObjKeys = imgsArray.map((items) => {
      return getObjectKey(items);
    });
    return availableObjKeys;

    // console.log(availableObjKeys);
    // console.log(allObjKeys);
    // const avaib = allObjKeys.find((ev) => !availableObjKeys.includes(ev));
    // console.log(avaib);

    // const leftoverObjKeys = allObjKeys.filter(
    //   (key) => !availableObjKeys.include(key)
    // );
    // console.log("leftOverKeys", leftoverObjKeys);
    // return leftoverObjKeys;
  };

  const [leftoverKeyState, setLeftOverKeyState] = useState([]);
  const deleteLeftOvers = useQueries({
    queries: leftoverKeyState?.map((leftover) => ({
      queryKey: [leftover],
      queryFn: async () => {
        console.log("lo", leftover);
        return await deleteImage(leftover);
      },
    })),
  });

  const checkKeysandDelete = async (allObjKeys, availableObjKeys) => {
    //function
    const leftoverObjKeysFunction = (allObjKeys, availableObjKeys) => {
      const leftover = allObjKeys.filter(
        (ev) => !availableObjKeys.includes(ev)
      );
      return leftover;
    };
    //

    /////////

    const leftoverObjKeys = leftoverObjKeysFunction(
      allObjKeys,
      availableObjKeys
    );
    //
    await setLeftOverKeyState(leftoverObjKeys);
    //actual calling
    console.log("leftoverObjKeys", leftoverObjKeys);

    // console.log("checkk pgadmin4 for proper addition");
    return deleteLeftOvers; //calls delete
  };

  //overall function
  const submitReview = async () => {
    const imgsArray = getAllInputSrc(quilRef);
    const availableObjKeys = getAvailableObjKeys(imgsArray);

    //this is working
    await allUploadStates.map((states) => {
      console.log(states);
      completeUpload(states);
    });

    //delete complete_upload stuff
    await checkKeysandDelete(allObjKeys, availableObjKeys); //
  };

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
          ml={600}
          variant="outline"
          onClick={async () => {
            console.log(quilRef.current.value);
            console.log(ratingValue);
            console.log("allObjKeys", allObjKeys);
            console.log(getAllUrlsFromObjKeys);
            const imgsArray = getAllInputSrc(quilRef);
            const availableObjKeys = getAvailableObjKeys(imgsArray);
            const y = await checkKeysandDelete(allObjKeys, availableObjKeys);
            console.log("checkadKeys function", y);
            console.log("button pressed");
          }}
        >
          Submit Review
        </Button>
        <Button onClick={submitReview}>Test Submit</Button>
      </body>
    </>
  );
}

export default DetailedReview;
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
    console.log(res.url, "res url is"); //this contains our objectKey that we need to extract
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

  //makeshift scheduleID
  const scheduleId = "3eb1f5e8-ed0b-49ec-b709-662f0ed104c6"; //we will append this to our url when creating review instead

  ///////////////////////////

  const imageHandler = useCallback(() => {
    const quilEditor = quilRef.current.getEditor();
    const quilSelection = quilEditor.getSelection(); //gets the current location users curser is at
    const imageInput = document.createElement("input"); //image input
    imageInput.setAttribute("type", "file"); //file types only
    imageInput.setAttribute("accept", "image/*"); //accepts images
    imageInput.click(); //mimicks click
    console.log(quilSelection, "quillSelection");

    imageInput.onchange = async () => {
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
        const objKey = await uploadAmazonS3(file, s3Body);
        console.log(objKey);
        const s3_url = await getFroms3(objKey);
        console.log(s3_url);
        //const url = cloudinaryImageUpload(file);
        //const imgPlaceHolder = "https://placehold.co/600x400?text=Placeholder";
        quilEditor.insertEmbed(quilSelection, "image", s3_url);
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

  const testParse = () => {
    const url = `https://nus-orbital-roamgram.s3.ap-southeast-2.amazonaws.com/uploads/d52df994-0c45-437f-bb32-5806409f405d/booking.png/image/png/3eb1f5e8-ed0b-49ec-b709-662f0ed104c6/633451c3b593fb89caaf818a0c721087?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240706T174952Z&X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost&X-Amz-Credential=AKIA4MTWIDUWB4UVOPQO%2F20240706%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Expires=1800&X-Amz-Signature=d2d3e8d7c479f0d9d1bcda40d0a1e2ab7742b13fda6f6ecaef61fdd07510b96d`;
    const newurl = new URL(url);
    console.log("new url", newurl);
    var urlParts = newurl.pathname;
    urlParts = urlParts.substring(1);
    console.log(urlParts);
  };

  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <Button onClick={testParse}></Button>
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
          onClick={() => {
            console.log(quilRef.current.value);
            console.log(ratingValue);
            getSelection();
          }}
        >
          Submit Review
        </Button>
      </body>
    </>
  );
}

export default DetailedReview;

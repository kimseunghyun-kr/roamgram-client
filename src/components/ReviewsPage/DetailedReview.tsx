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
    const res = await fetch(`https://localhost/media-file/upload-file-small`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(s3Body),
    }).then((res) => res.json());
    return res;
  }, []);

  const uploadAmazonS3 = async (file, s3Body) => {
    const presigned_url = await getPresignedURL(s3Body);
    console.log("presign", presigned_url);

    const formData = new FormData();
    formData.append("upload", file);
    console.log(`${presigned_url}`);
    console.log(file.type);
    const res = await fetch(`${presigned_url}`, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log(res);
  };

  const getFroms3 = async (objectKey) => {
    const get_url = fetch(`https://localhost/media-file/get-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectKey),
    }).then((res) => res.json());

    return get_url; //this is the s3 url we will get
  };

  const scheduleId = "3eb1f5e8-ed0b-49ec-b709-662f0ed104c6"; //we will append this to our url when creating review instead

  //async update so we shall not use this!
  const [fileBody, setFileBody] = useState({
    scheduleId: scheduleId,
    fileSize: 0,
    originalFileName: "",
    contentLocation: 0,
  });
  ///////////////////////////

  const imageHandler = useCallback(() => {
    const quilEditor = quilRef.current.getEditor();
    const quilSelection = quilEditor.getSelection(); //gets the current location users curser is at
    const imageInput = document.createElement("input"); //image input
    imageInput.setAttribute("type", "file"); //file types only
    imageInput.setAttribute("accept", "image/*"); //accepts images
    imageInput.click(); //mimicks click
    console.log(imageInput);
    console.log(quilSelection, "quillSelection");
    //if we have a file uploaded to reactQuill editor

    const reader = new FileReader();
    imageInput.onchange = async () => {
      if (imageInput !== null && imageInput.files !== null) {
        console.log(imageInput.files);
        const file = imageInput.files[0];

        const fileSize = file.size;
        const fileName = file.name;
        const contentLocation = quilSelection.index;
        console.log("file is", file);
        const s3Body = {
          scheduleId: scheduleId,
          fileSize: fileSize,
          originalFileName: fileName,
          contentLocation: contentLocation,
        };
        //getPresignedURL(s3Body);
        uploadAmazonS3(file, s3Body);
        //const url = cloudinaryImageUpload(file);
        //const imgPlaceHolder = "https://placehold.co/600x400?text=Placeholder";
        //quilEditor.insertEmbed(quilSelection, "image", imgPlaceHolder);
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

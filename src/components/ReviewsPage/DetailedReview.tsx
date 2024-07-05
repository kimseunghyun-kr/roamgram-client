import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header/Header";
import { useEffect, useMemo, useRef, useState } from "react";
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

  function imageHandler() {
    const quilEditor = quilRef.current.getEditor();
    const quilSelection = quilEditor.getSelection(); //gets the current location users curser is at
    console.log(quilEditor);
    console.log(quilSelection);
    const imageInput = document.createElement("input"); //image input
    imageInput.setAttribute("type", "file");
    imageInput.setAttribute("accept", "image/*");

    imageInput.click();
    //const imgPlaceHolder = "https://placehold.co/600x400?text=Placeholder";
    //quilEditor.insertEmbed(quilSelection, "image", imgPlaceHolder);
  }

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

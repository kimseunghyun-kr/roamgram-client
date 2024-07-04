import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header/Header";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Container, ScrollArea, Image } from "@mantine/core";

export function DetailedReview() {
  const [value, setValue] = useState("");

  //fonts
  const Font = Quill.import("formats/font");

  const modules = {
    toolbar: [
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
      [{ script: "sub" }, { script: "super" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "size",
    "font",
    "color",
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
  useEffect(() => {}, []);

  const quilRef = useRef(null);

  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <Image src="/assets/Create Review.png" w="auto" mt={35} />
        <Card withBorder w={1200}>
          <ScrollArea h={800}>
            <Container fluid w={1100} h="auto">
              <ReactQuill
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
        <Button
          ml={1300}
          variant="outline"
          onClick={() => {
            console.log(quilRef.current.value);
          }}
        >
          Submit Review
        </Button>
      </body>
    </>
  );
}

export default DetailedReview;

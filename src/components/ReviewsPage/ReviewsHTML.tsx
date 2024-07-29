import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { Container, Paper, Space, Text, Title } from "@mantine/core";
import "./ReviewsHTML.css";
import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";

function ReviewsHTML(props) {
  const pageHTML = useLocation()?.state["pageHTML"];
  const modules = {
    toolbar: false, // Disable the toolbar in read-only mode
  };
  console.log(pageHTML);
  const quilRef = useRef(null);

  useEffect(() => {
    if (quilRef.current) {
      const editor = quilRef.current.getEditor();
      editor.clipboard.dangerouslyPasteHTML(pageHTML);
    }
  }, [pageHTML]);

  console.log(pageHTML);
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <div>
          <Container mt={40}>
            <Title ff="Roboto">Review Details</Title>
            {/* <Paper withBorder shadow="md" p={30} mt={15} radius="md">
              <Text
                className="quill-content"
                dangerouslySetInnerHTML={{
                  __html: pageHTML,
                }}
              /> */}
            <Space h={20} />
            <ReactQuill
              ref={quilRef}
              value={""}
              readOnly={true}
              theme="snow"
              modules={modules}
            />
            {/* </Paper> */}
          </Container>
        </div>
      </body>
    </>
  );
}
export default ReviewsHTML;

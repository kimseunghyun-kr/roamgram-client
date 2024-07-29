import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { Container, Paper, Text, Title } from "@mantine/core";
import "./ReviewsHTML.css";

function ReviewsHTML(props) {
  const pageHTML = useLocation()?.state["pageHTML"];
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
            <Paper withBorder shadow="md" p={30} mt={15} radius="md">
              <Text
                className="quill-content"
                dangerouslySetInnerHTML={{
                  __html: pageHTML,
                }}
              />
            </Paper>
          </Container>
        </div>
      </body>
    </>
  );
}
export default ReviewsHTML;

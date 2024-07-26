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
  Flex,
  Stack,
  Grid,
  Modal,
  Text,
  Divider,
} from "@mantine/core";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import "./DetailedReview.css";

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
        console.log("s3 before decode is", s3_url);
        console.log("s3 after decode is", decodeURI(s3_url));
        sets3url(decodeURI(s3_url));
        const uploadStateBody = {
          objectKey: objKey,
          size: fileSize,
        };
        quilEditor.insertEmbed(quilSelection, "image", decodeURI(s3_url)); //encoded differently in HTML so we need to make edits
        setAllObjKeys((p) => [...p, objKey]);
        setAllUploadStates((p) => [...p, uploadStateBody]); //async
        console.log("s3 url is", s3_url);
        console.log("obj key is", objKey);
      }
    };
  }, []);

  const [s3url, sets3url] = useState("");

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
  const tpID = "9dad0de4-2535-4d89-b27b-f0d9699d48a9"; //testing purposes
  //do url extraction from quil.ref --> and compare the links

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
    imgsArray = imgsArray.map((items) => {
      return decodeURI(items.src);
    });
    console.log("imgsArray before map", imgsArray);

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

  const uploadReview = async () => {
    const rating = ratingValue;
    const userDescription = quilRef.current.getEditor().root.innerHTML; //stores it in html format
    const requestBody = {
      fileList: [
        {
          id: null,
          review: null,
          sizeBytes: null,
          contentType: null,
          originalFileName: null,
          s3Key: "",
          mediaFileStatus: "UPLOADED",
        },
      ],
      fileLocation: {
        additionalProp1: 0,
      },
      userDescription: userDescription,
      rating: rating,
      isPublic: true,
      public: true,
    };

    console.log("userdescription from uploadReview", userDescription);
    console.log("rq body", requestBody);

    await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelId}/schedule/${scheduleId}/review/upload`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log("success adding detailed reviews!@"))
      .catch((error) => console.log("error adding detailed review"));
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
    await uploadReview();

    return console.log("review has been submitted");
  };

  const testBody = {
    fileList: [
      {
        id: null,
        review: null,
        sizeBytes: null,
        contentType: null,
        originalFileName: null,
        s3Key: "",
        mediaFileStatus: null,
      },
    ],
    fileLocation: {
      additionalProp1: 0,
    },
    userDescription: ``,
    rating: 4.5,
    isPublic: true,
    public: true,
  };
  const webURL = new URLSearchParams(window.location.search);
  const travelId = webURL.get(`travelId`);
  const scheduleId = webURL.get(`scheduleId`);

  const testFunction = async () => {
    console.log("json stringify version to check", JSON.stringify(s3url));
    await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelId}/schedule/${scheduleId}/review/upload`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(testBody),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log("success adding detailed reviews!@"))
      .catch((error) => console.log("error adding detailed review"));
  };

  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const titleRef = useRef(null);

  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <Modal
          opened={opened}
          onClose={close}
          overlayProps={{
            backgroundOpacity: 0,
          }}
        >
          <Group justify="center" align="center">
            <Stack>
              <Text>
                Are you sure? This is{" "}
                <Text span c="red">
                  irreversible...
                </Text>
              </Text>

              <Button
                className="submit-button-review-detailed"
                variant="outline"
                onClick={async () => {
                  // await submitReview();
                  // navigate(-1);
                  console.log("innerHTML", quilRef.current.getEditor());
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Group>
        </Modal>
        <Container fluid w={1900}>
          <Group w={1600}>
            <Image src="/assets/Create Review.png" w="auto" mt={35} ml={340} />
            <Space w={640} />
            <Button
              onClick={open}
              mt={60}
              w={155}
              radius="xl"
              variant="outline"
            >
              Submit
            </Button>
          </Group>
        </Container>

        <Center>
          <Card withBorder w={1200} mt={20}>
            <ScrollArea h={650}>
              <Container fluid w={1100} h="auto">
                <Group justify="">
                  <Card withBorder radius="lg">
                    <Text size="sm">Give a Rating</Text>
                    <Divider></Divider>

                    <Rating
                      size="36px"
                      fractions={2}
                      pt={20}
                      value={ratingValue}
                      onChange={setRatingValue}
                    />
                    <Group justify="space-between">
                      <Text size="9px" c="gray">
                        Terrible
                      </Text>
                      <Text size="9px" c="gray">
                        Exceptional
                      </Text>
                    </Group>
                  </Card>
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
      </body>
      <Container fluid>
        <Flex justify="flex-end" w={1300}></Flex>
      </Container>
    </>
  );
}

export default DetailedReview;

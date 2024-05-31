import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.png";
import dropzone from "../assets/dropzone.png";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";

export default function Feedbacks() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [feedback, setFeedback] = useState({
    name: "",
    // phoneNumber: "",
    rating: 0,
    content: "",
    images: [],
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const { page } = useParams();
  const [totalPages, setTotalPages] = useState(1);
  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/api/review/list/" + (page - 1)
      );
      setFeedbackList(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
    setReload(false);
  }, [page]);

  const [reload, setReload] = useState(true);

  const navigate = useNavigate();
  const handleNextPage = () => {
    const nextPage = parseInt(page) + 1;
    setFeedbackList([]);
    setReload(true);
    navigate(`/feedbacks/${nextPage}`);
  };

  const handlePreviousPage = () => {
    const prevPage = parseInt(page) - 1;
    setFeedbackList([]);
    setReload(true);
    navigate(`/feedbacks/${prevPage}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={parseInt(page) === i ? "primary" : "secondary"}
          onClick={() => {
            setReload(true);
            setFeedbackList([]);
            navigate(`/feedbacks/${i}`);
          }}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    reload && fetchFeedbacks();
  }, [fetchFeedbacks, reload]);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const imageFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        images: [...prevFeedback.images, ...imageFiles],
      }));
    } catch (error) {
      console.error("Error encoding image files:", error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const key in feedback) {
        if (key !== "images" && key !== "rating") {
          if (feedback[key].trim() === "") {
            throw Error("Vui lòng nhập đủ thông tin feedback");
          }
        } else if (key === "rating" && feedback.rating <= 0) {
          throw Error("Vui lòng nhập đủ thông tin feedback");
        }
      }

      const res = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/review",
        { ...feedback }
      );
      toast(res.data.message, {
        className: "bg-success text-white",
      });
      handleClose();
      setFeedback({
        name: "",
        // phoneNumber: "",
        rating: 0,
        content: "",
        images: [],
      });
      setReload(true);
    } catch (error) {
      toast(error.message, {
        className: "bg-danger text-white",
      });
    }
  };

  const renderRating = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<i key={i} className="text-warning fa-solid fa-star"></i>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={filledStars + i} className="fa-solid fa-star"></i>);
    }

    return stars;
  };
  return (
    <>
      <MainLayout>
        <Container fluid className="pt-3">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <span className="fs-1 text-baca">
              <i className="fa-brands fa-wpforms me-2"></i>
              <span>Đánh giá</span>
            </span>
            <Button className="bg-baca text-baca border-0" onClick={handleShow}>
              Để lại đánh giá
            </Button>
          </div>
          {feedbackList.map((f) => (
            <Row
              key={f._id}
              className="pb-3 mt-3"
              style={{ borderBottom: "1px solid black" }}
            >
              <Col>
                <div className="d-flex">
                  <div
                    className="w-100 rounded-circle overflow-hidden border border-dark"
                    style={{
                      maxWidth: "60px",
                      maxHeight: "60px",
                      aspectRatio: "1/1",
                    }}
                  >
                    <img className="w-100" src={defaultAvatar} alt="avatar" />
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <div>
                      <strong>{f.name}</strong>
                    </div>
                    <div>{renderRating(f.rating)}</div>
                    <div>{f.content}</div>
                    <div className="mt-3 d-flex flex-wrap align-items-start">
                      {f.images.map((image, i) => (
                        <img
                          key={i}
                          src={image}
                          style={{ maxWidth: "100px" }}
                          alt="feedback"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              disabled={parseInt(page) === 1}
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
            <div>{renderPageNumbers()}</div>
            <Button
              variant="secondary"
              disabled={parseInt(page) === totalPages}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </Container>
      </MainLayout>
      <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="text-baca">Để lại đánh giá</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>
                Tên <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className="mb-3"
                required
                type="text"
                value={feedback.name}
                onChange={(e) =>
                  setFeedback((pre) => ({ ...pre, name: e.target.value }))
                }
              />
            </Form.Group>
            {/* <Form.Group controlId="phoneNumber">
              <Form.Label>
                Số điện thoại <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className="mb-3"
                required
                type="text"
                value={feedback.phoneNumber}
                onChange={(e) =>
                  setFeedback((pre) => ({
                    ...pre,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </Form.Group> */}
            <Form.Group controlId="rating">
              <Form.Label>
                Đánh giá <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex mb-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <i
                    key={rating}
                    className={`fa-solid fa-star ${
                      rating <= feedback.rating ? "text-warning" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setFeedback((prevFeedback) => ({
                        ...prevFeedback,
                        rating: rating,
                      }))
                    }
                  ></i>
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>
                Nội dung <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className="mb-3"
                required
                as="textarea"
                rows={3}
                value={feedback.content}
                onChange={(e) =>
                  setFeedback((pre) => ({ ...pre, content: e.target.value }))
                }
              />
            </Form.Group>
            <div {...getRootProps()}>
              <Form.Label>Hình ảnh/Video:</Form.Label>
              <div className="mt-3d-flex flex-wrap align-items-start">
                {feedback.images.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    style={{ maxWidth: "100px" }}
                    alt="feedback"
                    className="me-2"
                  />
                ))}
              </div>
              <input {...getInputProps()} />
              <img src={dropzone} className="w-100" alt="dropzone" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button className="border-0 bg-baca" type="submit">
              Gửi đánh giá
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

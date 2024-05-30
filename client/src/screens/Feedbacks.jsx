import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap";

export default function Feedbacks() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [feedback, setFeedback] = useState({
    name: "",
    phoneNumber: "",
    content: "",
  });
  return (
    <>
      <MainLayout>
        <Container fluid className="pt-3">
          <div className="d-flex w-100 justify-content-between align-items-center mb-5">
            <span className="fs-1 text-baca">
              <i class="fa-brands fa-wpforms me-2"></i>
              <span>Đánh giá</span>
            </span>
            <Button className="bg-baca text-baca border-0" onClick={handleShow}>
              Để lại đánh giá
            </Button>
          </div>
          <Row className="pb-3" style={{ borderBottom: "1px solid black" }}>
            <Col xs={2}>
              <div className="w-100 rounded-circle overflow-hidden border border-dark">
                <img
                  className="w-100"
                  src="https://fastly.picsum.photos/id/484/200/200.jpg?hmac=3rqhoyJTHVOGelhVPMaglcnpAMl_V3cvNkHZDpSz6_g"
                  alt="avatar"
                />
              </div>
            </Col>
            <Col xs={10}>
              <div>
                <strong>Hoàng Nam</strong>
              </div>
              <div>
                <i class="text-warning fa-solid fa-star"></i>
                <i class="text-warning fa-solid fa-star"></i>
                <i class="text-warning fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas consectetur mollis faucibus. Curabitur feugiat nulla
                metus, interdum efficitur nisl faucibus non
              </div>
            </Col>
          </Row>
        </Container>
      </MainLayout>
      <Modal show={show} onHide={handleClose} centered>
        <Form>
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
            <Form.Group controlId="phoneNumber">
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
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>
                Đánh giá <span className="text-danger">*</span>
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
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Hình ảnh/video đính kèm</Form.Label>
              <Form.Control type="file" multiple />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button className="border-0 bg-baca" onClick={handleClose}>
              Gửi đánh giá
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

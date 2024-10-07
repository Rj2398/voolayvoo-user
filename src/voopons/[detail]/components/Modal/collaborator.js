import Image from "next/image";
import { Modal, Box } from "@mui/material";
import { BASE_URL } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Collaborator = ({ open, setOpen, data }) => {
  const router = useRouter();
  const goToCollaborator = (id) => {
    if (id) {
      router.push(`/promoters/${id}`);
    } else {
      toast.error("Promoter id is not valid");
    }
  };
  return (
    <>
      <Modal open={open}>
        <Box>
          <div
            className="modal fade show"
            style={{ display: "block", paddingRight: "0px" }}
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
              >
                <div className="modal-header">
                  <h5 className="modal-title modal-title-center" id="">
                    Collaborator(s)
                  </h5>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="close collab-btn"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="collaborat-pop-box">
                    {Array.isArray(data) &&
                      data?.map((item) => (
                        <div
                          className="collab-iner-box"
                          key={item.id}
                          onClick={() => goToCollaborator(item?.promoter_id)}
                        >
                          <div className="colb-img">
                            <Image
                              width={78}
                              height={78}
                              src={
                                item?.promoter_data?.profile_image
                                  ? `${BASE_URL}/${item?.promoter_data?.profile_image}`
                                  : "/images/amf.png"
                              }
                              alt=""
                            />
                          </div>
                          <div className="colb-text">
                            <h1 style={{ textTransform: "uppercase" }}>
                              {item?.promoter_data?.name}
                            </h1>
                            <h6 className="location-add">
                              <span>
                                <Image
                                  width={16}
                                  height={17}
                                  src="/images/col-location.png"
                                  alt=""
                                />
                              </span>
                              <span>{item?.promoter_data?.location}</span>
                            </h6>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Collaborator;

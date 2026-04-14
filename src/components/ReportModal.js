import React, { useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useAuth } from "@/app/UserProvider"; // Adjust path to your provider
import { toast } from "react-toastify"; // Optional: for feedback
import { BASE_URL } from "@/constant/constant";

const ReportModal = ({ open, handleClose, reportData, eventOrVoopon }) => {
  const { userDetails } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user-report`,
        {
          user_id: userDetails?.user_id,
          message: message,
          event_id: reportData?.event_id || "",
          voopon_id: reportData?.voopon_id || "",
          type: reportData?.type || "event", // 'event' or 'voopon'
        },
        {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setMessage("");
        handleClose();
      } else {
        toast.success(response.data.message);
        setMessage("");
        handleClose();
      }
    } catch (error) {
      handleClose();

      toast.error("Failed to submit report. Please try again.");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "450px",
          bgcolor: "#fff",
          borderRadius: "16px",
          position: "relative",
          p: 4,
          outline: "none",
          boxShadow: 24,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Report {eventOrVoopon}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Describe your concern here..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: "#FF0015",
            color: "#fff",
            fontWeight: "bold",
            py: 1.5,
            borderRadius: "50px",
            "&:hover": { bgcolor: "#d40012" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Report"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default ReportModal;

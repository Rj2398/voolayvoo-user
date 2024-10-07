import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/constant/constant";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// VooponCard component to display individual Voopon details
const VooponCard = ({ voopon }) => {
  return (
    <div style={styles.card}>
      <div
        style={{
          ...styles.imageContainer,
          backgroundImage: `url(${BASE_URL + voopon.vooponimage.image_name})`,
        }}
      ></div>
      <div style={styles.details}>
        <h5 style={styles.title}>{voopon.voopons_name}</h5>
        <h2 style={styles.storeName}>Fashion Store</h2>
        <h5 style={styles.discount}>Flat 20% Off</h5>
        <Link href={`/voopons/${voopon.category_id}`} style={styles.link}>
          Explore More
        </Link>
      </div>
    </div>
  );
};

// Main VooponYouLove component
const VooponYouLoveTwo = ({ staticItems }) => {
  const [vooponseYouLove, setVooponseYouLove] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerRow = 3; // Number of items to show at once

  useEffect(() => {
    if (staticItems?.voopon_data_one && staticItems?.voopon_data_two) {
      const updatedArrayTwo = staticItems.voopon_data_two.map((item) => ({
        ...item,
        vooponimage: item.business_voopon_image || null,
      }));

      const mergedArray = [...staticItems.voopon_data_one, ...updatedArrayTwo];
      setVooponseYouLove(mergedArray);
    }
  }, [staticItems]);

  const totalItems = vooponseYouLove.length;

  const nextPage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (totalItems - itemsPerRow + 1)
    );
  };

  const prevPage = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + (totalItems - itemsPerRow + 1)) %
        (totalItems - itemsPerRow + 1)
    );
  };

  const displayedItems = vooponseYouLove.slice(
    currentIndex,
    currentIndex + itemsPerRow
  );

  return (
    <section style={styles.container}>
      <h2 style={styles.header}>Voopons You Will Love</h2>
      <div style={styles.cardContainer}>
        {displayedItems.map((voopon) => (
          <VooponCard key={voopon.category_id} voopon={voopon} />
        ))}
      </div>
      <div style={styles.overlay}>
        <button
          onClick={prevPage}
          style={{ ...styles.overlayButton, left: "10px" }}
        >
          <KeyboardArrowLeftIcon />
        </button>
        <button
          onClick={nextPage}
          style={{ ...styles.overlayButton, right: "10px" }}
        >
          <KeyboardArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

// Inline styles
const styles = {
  container: {
    position: "relative",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  card: {
    flex: "1 0 30%", // Adjusts to 3 cards per row
    margin: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px 0 87px 0", // Adjusted for bottom right corner
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  imageContainer: {
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    // height: "400px",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "none", // Hide the img as we're using background image
  },
  details: {
    padding: "15px",
    // backgroundColor: "pink",
    // position: "absolute",
    // bottom: "50px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  storeName: {
    fontSize: "22px",
    color: "#333",
  },
  discount: {
    fontSize: "18px",
    color: "#888",
  },
  link: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#f00",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    marginTop: "10px",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    transform: "translateY(-50%)",
    zIndex: 1,
  },
  overlayButton: {
    padding: "10px 20px",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default VooponYouLoveTwo;

//

import Image from "next/image";
import { Card } from "@mui/material";

const NotFoundPage = () => {
  return (
    <>
      <Card className="p-5 text-center">
        <Image width={420} height={300} src={"/images/not-found.png"} alt="" />
      </Card>
    </>
  );
};

export default NotFoundPage;

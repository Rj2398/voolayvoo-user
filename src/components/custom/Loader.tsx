// Loader.tsx
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
interface LoaderProps {
  loading: boolean;
}
const Loader: React.FC<LoaderProps> = ({ loading }: LoaderProps) => {
  return (
    <div className="loader">
      <ClipLoader color="#3498db" size={100} loading={loading} />
      <p>Loading...</p>
      <style jsx>{`
        .loader {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Loader;

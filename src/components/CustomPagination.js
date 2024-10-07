import { useEffect, useState } from "react";

const CustomPagination = ({
  dataArray = [],
  clickPageNumber,
  pageNo,
  pageLimit = 9,
}) => {
  const totalPages = Math.ceil(dataArray?.length / pageLimit);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(pageNo);
  }, [pageNo]);
  const handlePageChange = (page) => {
    clickPageNumber(page);
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li className="page-item" key={i}>
          <a
            className="page-link"
            onClick={() => handlePageChange(i)}
            style={{
              cursor: "pointer",
              color: currentPage === i ? "#FFF" : "inherit",
              backgroundColor: currentPage === i ? "#F10027" : "inherit",
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      {totalPages > 1 && (
        <div className="col-lg-12 text-center">
          <nav className="pagingation-style">
            <ul className="pagination">
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() =>
                    currentPage !== 1 && handlePageChange(currentPage - 1)
                  }
                  style={{ cursor: "pointer" }}
                >
                  Prev
                </a>
              </li>
              {renderPageNumbers()}

              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() =>
                    currentPage !== totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  style={{ cursor: "pointer" }}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CustomPagination;

"use client";
import CustomPagination from "@/components/CustomPagination";
import Card from "./Card";
import { useEffect, useState } from "react";

const Voopons = ({ dataList = [] }) => {
  const [tempList, setTempList] = useState(dataList);
  const [renderList, setRenderList] = useState([]);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    if (dataList) {
      setTempList(dataList);
      const tempEvtList = dataList.filter((item, indx) => indx < 9);
      setRenderList(tempEvtList);
    }
  }, [dataList]);

  const handlePageChange = () => {
    let newEventList = [];
    for (let num = 8; num >= 0; num--) {
      let cal = pageNo * 9 - num;
      if (dataList.length > cal) {
        newEventList.push(dataList[cal]);
      }
    }
    setPageNo(pageNo);
    setRenderList(newEventList[pageNo - 1]);
  };
  return (
    <>
      <div
        className="tab-pane fade"
        id="voopons"
        role="tabpanel"
        aria-labelledby="voopons-tab"
      >
        <div className="row">
          {renderList?.length > 0 &&
            renderList.map((item) => <Card key={item?.id} data={item} />)}
        </div>
        <div className="row">
          {Array.isArray(renderList) && renderList?.length === 0 && (
            <p className="noDataText">No Voopons</p>
          )}
        </div>
        <CustomPagination
          dataArray={tempList}
          pageNo={pageNo}
          clickPageNumber={handlePageChange}
          pageLimit={9}
        />
      </div>
    </>
  );
};

export default Voopons;

import React from "react";
interface textsProp {
  Name?: string;
  value?: any;
}
function ResultLists(prop: textsProp) {
  return (
    <div className="flex w-full p-1 tablesofresult">
      <div className="w-3/4">{prop.Name}</div>
      <div className="w-1/2 flex justify-start">{prop.value}</div>
    </div>
  );
}

export default ResultLists;

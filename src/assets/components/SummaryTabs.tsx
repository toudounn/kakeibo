import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import CardSummary from "./CardSummary";
import PointSummary from "./PointSummary";

export default function SummaryTabs() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* タブメニュー */}
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="カード払い合計" />
        <Tab label="ポイント払い合計" />
      </Tabs>

      {/* タブごとの内容 */}
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <CardSummary />}
        {tabIndex === 1 && <PointSummary />}
      </Box>
    </Box>
  );
}

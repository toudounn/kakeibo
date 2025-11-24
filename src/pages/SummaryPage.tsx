// src/pages/SummaryPage.tsx
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import CardSummary from "../assets/components/CardSummary";
import PointSummary from "../assets/components/PointSummary";

export default function SummaryPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "70%", p: 2 , mx:"auto" }}>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="カード払い合計" />
        <Tab label="ポイント払い合計" />
      </Tabs>

      <Box sx={{ mt: 3  }}>
        {tabIndex === 0 && <CardSummary />}
        {tabIndex === 1 && <PointSummary />}
      </Box>
    </Box>
  );
}

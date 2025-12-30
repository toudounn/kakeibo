// src/pages/SummaryPage.tsx
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import CardSummary from "../assets/components/CardSummary";
import PointSummary from "../assets/components/PointSummary";
import GraphPage from "./GraphPage";
import { messageSx } from "./Category";

export default function SummaryPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleChange}  variant="scrollable" scrollButtons="auto" >
        <Tab label="カード払い合計" />
        <Tab label="ポイント払い合計" />
        <Tab label="グラフ"/>
      </Tabs>

      <Box sx={{ mt: 3  }}>
        {tabIndex === 0 && <CardSummary />}
        {tabIndex === 1 && <PointSummary />}
        {tabIndex === 2 && (
          <>
            <Box
            sx={messageSx}
            >
              横向きにすると見やすくなります
            </Box>
            <GraphPage />
          </> )}
      </Box>
    </Box>
  );
}

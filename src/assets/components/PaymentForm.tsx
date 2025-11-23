import { useEffect } from "react";
import { TextField, MenuItem, Box } from "@mui/material";

export default function PaymentForm({ payment, paymentType, onChange }:any) {
  // 支払方法の選択肢
  const paymentMethods = ["現金", "カード", "ポイント"];

  // カード・ポイントの種類は localStorage から読み込むようにすると拡張可能
  const storedCards = localStorage.getItem("cardTypes");
  const storedPoints = localStorage.getItem("pointTypes");
  const cardTypes = storedCards ? JSON.parse(storedCards) : ["Visa", "MasterCard", "JCB"];
  const pointTypes = storedPoints ? JSON.parse(storedPoints) : ["楽天ポイント", "Tポイント", "dポイント"];

  useEffect(() => {
    onChange({ payment, paymentType });
  }, [payment, paymentType]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {/* 支払方法 */}
      <TextField
        select
        label="支払方法"
        value={payment}
        onChange={(e) => onChange({ payment: e.target.value, paymentType: "" })}
      >
        {paymentMethods.map((method) => (
          <MenuItem key={method} value={method}>
            {method}
          </MenuItem>
        ))}
      </TextField>

      {/* 種類選択（カード or ポイントのときだけ表示） */}
      {(payment === "カード" || payment === "ポイント") && (
        <TextField
          select
          label={`${payment}の種類`}
          value={paymentType}
          onChange={(e) => onChange({ payment, paymentType: e.target.value })}
        >
          {(payment === "カード" ? cardTypes : pointTypes).map((type:any) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
}

import { useEffect, useState } from "react";
import { TextField, MenuItem, Box } from "@mui/material";
import { getCardTypes, getPointTypes} from "../../db/indexedDB";

export default function PaymentForm({ payment, paymentType, onChange }: any) {
  // 支払方法の選択肢
  const paymentMethods = ["現金", "カード", "ポイント"];

  // IndexedDBから読み込むカード・ポイント種類
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [pointTypes, setPointTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let cards = await getCardTypes();
      let points = await getPointTypes();

      // 初期値が空ならデフォルトを設定
      // if (cards.length === 0) {
      //   cards = ["Visa", "MasterCard", "JCB"];
      //   await saveCardTypes(cards);
      // }
      // if (points.length === 0) {
      //   points = ["楽天ポイント", "Tポイント", "dポイント"];
      //   await savePointTypes(points);
      // }

      setCardTypes(cards);
      setPointTypes(points);
    };

    fetchData();
  }, []);

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
          {(payment === "カード" ? cardTypes : pointTypes).map((type: string) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
}

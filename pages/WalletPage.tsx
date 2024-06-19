import {
  Checkbox,
  NativeSelect,
  NumberInput,
  RingProgress,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React from "react";

function WalletPage() {
  return (
    <>
      <h1>Test</h1>
      <RingProgress
        size={280}
        roundCaps
        thickness={21}
        label={<Text ta="center">$$ Here</Text>}
        sections={[
          { value: 40, color: "cyan", tooltip: "Look at tooltip" },
          { value: 15, color: "orange" },
          { value: 15, color: "grape" },
        ]}
      ></RingProgress>
      <Checkbox label="type 1"></Checkbox>
      <Checkbox label="type 2"></Checkbox>
      <Checkbox label="type 3"></Checkbox>
      <Checkbox label="type 4"></Checkbox>
      <NumberInput
        allowNegative={false}
        decimalScale={2}
        prefix="$"
        placeholder="$ Amount spent"
      ></NumberInput>
      <UnstyledButton> Add to Expenditure</UnstyledButton>
    </>
  );
}

export default WalletPage;

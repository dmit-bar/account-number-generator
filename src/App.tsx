import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Callout,
  Card,
  Code,
  Container,
  Flex,
  Grid,
  Link,
  Strong,
  Text,
  TextField,
  Theme,
  Tooltip,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { NOT_EXACT_LENGTH, NOT_NUMBER, generateAccountNumber } from "./utils";

const schema = yup
  .object({
    bic: yup
      .string()
      .nullable()
      .required()
      .matches(/^\d+$/, NOT_NUMBER)
      .test("len", NOT_EXACT_LENGTH(9), (val) => val?.toString().length === 9),
    accountMask: yup
      .string()
      .nullable()
      .required()
      .matches(/^\d+$/, NOT_NUMBER)
      .test("len", NOT_EXACT_LENGTH(5), (val) => val?.toString().length === 5),
    currencyCode: yup
      .string()
      .nullable()
      .required()
      .matches(/^\d+$/, NOT_NUMBER)
      .test("len", NOT_EXACT_LENGTH(3), (val) => val?.toString().length === 3),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

function App() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bic: "044525593", // БИК Альфа-Банк
      currencyCode: "810", // Рубль
    },
    resolver: yupResolver(schema),
  });

  const [accountNumber, setAccountNumber] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onCopyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);

    setTooltipOpen(true);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 1500);
  };

  const onSubmit = (data: FormData) => {
    setAccountNumber(
      generateAccountNumber(data.bic, data.accountMask, data.currencyCode)
    );
  };

  return (
    <Theme appearance="dark" accentColor="red" id="theme-wrapper">
      <Container size="2" m={"auto"}>
        <Card size={"3"}>
          <Flex
            direction={"column"}
            justify={"center"}
            align={"center"}
            gap={"3"}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                direction={"column"}
                justify={"center"}
                align={"center"}
                gap={"3"}
              >
                <Grid columns={"3"} gap={"4"}>
                  <Flex direction={"column"} gap={"1"}>
                    <Text as="label" size={"2"}>
                      <Strong>БИК</Strong>
                    </Text>
                    <TextField.Input
                      size="2"
                      placeholder="044525225"
                      autoComplete="off"
                      maxLength={9}
                      {...register("bic")}
                    />
                    {errors?.bic && (
                      <Text as="span" size={"1"} color="ruby">
                        {errors?.bic.message}
                      </Text>
                    )}
                  </Flex>
                  <Flex direction={"column"} gap={"1"}>
                    <Text as="label" size={"2"}>
                      <Strong>Маска счета</Strong>
                    </Text>
                    <TextField.Input
                      size="2"
                      placeholder="12345"
                      autoComplete="off"
                      maxLength={5}
                      {...register("accountMask")}
                    />
                    {errors?.accountMask && (
                      <Text as="span" size={"1"} color="ruby">
                        {errors?.accountMask.message}
                      </Text>
                    )}
                  </Flex>
                  <Flex direction={"column"} gap={"1"}>
                    <Text as="label" size={"2"}>
                      <Strong>Код валюты</Strong>
                    </Text>
                    <TextField.Input
                      size="2"
                      placeholder="12345"
                      autoComplete="off"
                      maxLength={3}
                      {...register("currencyCode")}
                    />
                    {errors?.currencyCode && (
                      <Text as="span" size={"1"} color="ruby">
                        {errors?.currencyCode.message}
                      </Text>
                    )}
                  </Flex>
                </Grid>
                <Box my={"3"}>
                  <Button type="submit" size={"2"}>
                    Сгенерировать номер счета
                  </Button>
                </Box>
              </Flex>
            </form>
            {accountNumber && (
              <Callout.Root color="teal">
                <Tooltip
                  disableHoverableContent={true}
                  open={tooltipOpen}
                  content="Скопировано!"
                >
                  <Callout.Text align={"center"}>
                    <Link onClick={onCopyAccountNumber} underline="hover">
                      <Code variant="ghost" size={"4"}>
                        {accountNumber}
                      </Code>
                    </Link>
                  </Callout.Text>
                </Tooltip>
              </Callout.Root>
            )}
          </Flex>
        </Card>
      </Container>
    </Theme>
  );
}

export default App;

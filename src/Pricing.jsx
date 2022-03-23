import React from "react";
import { Button, CircularProgress, Dialog, Tooltip } from "@material-ui/core";
import _ from "lodash";
import ReplayIcon from "@material-ui/icons/Replay";
import Card from "@material-ui/core/Card";
import Dashboard from "./Dashboard";
import { useGetOrders } from "./Orders/ordersQueries";
// import EmptyLogo from "../static/images/empty-state.svg";
import Colors from "./shared/colors";
import OrderRow from "./Orders/OrderRow";
import ErrorWithMessage from "./shared/components/ErrorWithMessage";
import LoaderWithMessage from "./shared/components/LoaderWithMessage";
import { Class } from "@material-ui/icons";
import Box from "@mui/material/Box";
import client, { endpoint } from "./shared/network/client";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import { clearQueryCache, queries } from "./shared/network/queryClient";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Typography from "@mui/material/Typography";
import { getApiError } from "./shared/utils";

import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Paper from "@material-ui/core/Paper";

import OpacityIcon from "@material-ui/icons/Opacity";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, styled } from "@material-ui/core/styles";
import trialLogo from "./icons/trial_logo.png";
import basicLogo from "./icons/basic_logo.png";
import proLogo from "./icons/pro_logo.png";
import enterpriseLogo from "./icons/enterprise_logo.png";
import tickLogo from "./icons/tick_logo.png";
import crossLogo from "./icons/cross_logo.png";
import Switch from "@mui/material/Switch";
import BillingDetailsForm from "./ProjectPayment/BillingDetailsForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  totalTable: {
    minWidth: 650,
    marginBottom: 15,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
}));

const StyledTableRow = styled(TableCell)({
  border: "0px",
});

const RecieptSubHeadings = styled(TableCell)({
  borderBottom: "0px",
});

const pricingData = async () => {
  try {
    const { data } = await client.get(endpoint.products2, {
      timeout: 480000,
    });
    return data;
  } catch (error) {
    throw "getApiError(error)";
  }
};

export const usePricingData = () => {
  return useQuery([queries.products], pricingData, {
    refetchOnWindowFocus: false,
  });
};

function BillSection(headings, rows, headingIcon) {
  const classes = useStyles();
}

const Pricing = () => {
  var dataTransferTemp = [[], [], []];
  var dataTransferTemp2AC = [[], [], []];
  var dataTransferTemp3C = [[], [], []];
  var dataTransferTemp4V = [[], [], []];
  const [durationMY, setDurationMY] = React.useState(0);

  const tiers = [
    {
      title: "Trial",
      price: "0",
      description: ["Get the Trial, free"],
      logo: trialLogo,
      buttonText: "SUBSCRIBE",
      buttonVariant: "outlined",
    },
    {
      title: "Basic",
      price: "15",
      description: ["Everything in Trial, Plus"],
      buttonText: "SUBSCRIBE",
      buttonVariant: "outlined",
      logo: basicLogo,
    },
    {
      title: "Pro",
      price: "30",
      description: ["Everything in Basic, Plus"],
      buttonText: "SUBSCRIBE",
      buttonVariant: "outlined",
      logo: proLogo,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: ["Everything in Pro, Plus"],
      buttonText: "CONTACT US",
      buttonVariant: "outlined",
      logo: enterpriseLogo,
    },
  ];
  const headings = ["PROJECTS", "API LIFECYCLE", "CONNECTORS", "VALIDITY"];
  const rows = [
    [
      {
        name: "No. of API Design",
        trial: "",
        basic: "",
        pro: "",
        enterprise: "unlimited",
      },
      {
        name: "No. of Republish",
        trial: "",
        basic: "",
        pro: "",
        enterprise: "unlimited",
      },

      {
        name: "No. of Creator Licenses",
        trial: "",
        basic: "",
        pro: "",
        enterprise: "unlimited",
      },

      {
        name: "No. of Collaborators",
        trial: "",
        basic: "",
        pro: "",
        enterprise: "unlimited",
      },
    ],
    [
      {
        name: "Specs",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
      {
        name: "Code",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },

      {
        name: "Mock",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },

      {
        name: "Test Data",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
      {
        name: "Functional Test",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
      {
        name: "Performance Test",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
      {
        name: "Security Test",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
    ],
    [
      {
        name: "MS SQL Server",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
      {
        name: "MYSQL",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },

      {
        name: "Postgres",
        trial: "",
        basic: "",
        pro: "",
        enterprise: true,
      },
    ],
    [
      {
        name: "Validity",
        trial: "",
        basic: "",
        pro: "",
        enterprise: "Contract Based",
      },
    ],
    // createData("No. of API Design", "Unlimited"),
    // createData("No. of Republish", 5, 10, 10, "Unlimited"),
    // createData("No. of Creator Licenses", 5, 10, 10, "Unlimited"),
    // createData("No. of Collaborators", 5, 10, 10, "Unlimited"),
  ];
  // function createData(name, enterprise) {
  //   return { name, trial, basic, pro, enterprise };
  // }

  const { data: pricing_data } = usePricingData();
  if (!_.isEmpty(pricing_data?.products)) {
    // console.log(pricing_data["products"]);

    pricing_data["products"].map((item, index) => {
      // for (let i = 1; i < 3; i++) {
      //   if (!_.isEmpty(item["stripe"])) {
      if (durationMY == 0) {
        tiers[1]["price"] =
          pricing_data["products"][0]["stripe"][0]["plan_price"];
        tiers[2]["price"] =
          pricing_data["products"][1]["stripe"][1]["plan_price"];
      }
      if (durationMY == 1) {
        tiers[1]["price"] =
          pricing_data["products"][0]["stripe"][1]["plan_price"];
        tiers[2]["price"] =
          pricing_data["products"][1]["stripe"][0]["plan_price"];
      }

      //   }
      // }

      dataTransferTemp[index].push(
        item["no_of_projects"],
        item["no_of_republish"],
        item["no_of_creator_licenses"],
        item["no_of_collaborators"]
      );
      dataTransferTemp2AC[index].push(
        item["spec"],
        item["code"],
        item["mock"],
        item["test_data"],
        item["functional_tests"],
        item["performance_tests"],
        item["security_tests"]
      );
      dataTransferTemp3C[index].push(
        item["connectors"]["ms_sql"],
        item["connectors"]["my_sql"],
        item["connectors"]["postgres"]
      );
      dataTransferTemp4V[index].push(item["validity"]);
    });

    for (let i = 0; i <= 3; i++) {
      rows[0][i]["trial"] = dataTransferTemp[2][i];
      rows[0][i]["basic"] = dataTransferTemp[0][i];
      rows[0][i]["pro"] = dataTransferTemp[1][i];
    }
    for (let i = 0; i <= 6; i++) {
      rows[1][i]["trial"] = dataTransferTemp2AC[2][i];
      rows[1][i]["basic"] = dataTransferTemp2AC[0][i];
      rows[1][i]["pro"] = dataTransferTemp2AC[1][i];
    }
    for (let i = 0; i <= 2; i++) {
      rows[2][i]["trial"] = dataTransferTemp3C[2][i];
      rows[2][i]["basic"] = dataTransferTemp3C[0][i];
      rows[2][i]["pro"] = dataTransferTemp3C[1][i];
    }
    for (let i = 0; i < 1; i++) {
      rows[3][i]["trial"] = dataTransferTemp4V[2][i];
      rows[3][i]["basic"] = dataTransferTemp4V[0][i];
      rows[3][i]["pro"] = dataTransferTemp4V[1][i];
    }

    // console.log(tiers);
    // console.log(rows);
  }
  const classes = useStyles();

  return (
    <Dashboard selectedIndex={3}>
      <div className="flex flex-col">
        <div id="heading" className="flex flex-col py-3 self-center">
          {" "}
          <h1>The Right Pricing Plan for Your Business</h1>
        </div>

        <div id="durationMY" className="flex flex-row py-3 self-center">
          <Button
            onClick={() => {
              setDurationMY(0);
            }}
          >
            Monthly
          </Button>
          <Switch defaultChecked />
          <Button
            onClick={() => {
              setDurationMY(1);
            }}
          >
            Yearly
          </Button>
        </div>

        <div
          id="pricingTypeCards"
          className="flex flex-row self-end w-5/6 mr-16"
        >
          <Container
            style={{ width: 900 }}
            // className="flex mx-2  bg-green-900  "
            component="main"
          >
            <Grid container spacing={2}>
              {tiers.map((tier) => (
                <Grid
                  item
                  key={tier.title}
                  // xs={5}
                  // sm={tier.title === "Enterprise" ? 12 : 6}
                  md={3}
                >
                  <Card className="flex flex-col">
                    <div className="flex justify-center ...">
                      {" "}
                      <img src={tier.logo} alt="logo" />
                    </div>

                    <CardHeader
                      title={tier.title}
                      titleTypographyProps={{ align: "center" }}

                      // sx={{
                      //   backgroundColor: (theme) =>
                      //     theme.palette.mode === "light"
                      //       ? theme.palette.grey[200]
                      //       : theme.palette.grey[700],
                      // }}
                    />
                    <CardContent className="flex flex-col">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                          mb: 2,
                        }}
                      >
                        <Typography
                          // action={
                          //   tier.title === "Enterprise"
                          //     ? (component = "h4")
                          //     : (component = "h4")
                          // }
                          component="h4"
                          variant="h5"
                          color="#2FDAA1"
                        >
                          ${tier.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          /mo
                        </Typography>
                      </Box>
                      <ul className="flex flex-col h-3">
                        {tier.description.map((line) => (
                          <Typography
                            component="li"
                            variant="subtitle1"
                            align="center"
                            key={line}
                          >
                            {line}
                          </Typography>
                        ))}
                      </ul>
                    </CardContent>
                    <CardActions className="flex my-10 ">
                      <Button
                        // onClick={
                        //   <BillingDetailsForm
                        //     formRef={billingDetailsRef}
                        //     disabled={false}
                        //   />
                        // }
                        fullWidth
                        variant={tier.buttonVariant}
                      >
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>

        <div id="pricingDataTables" className="flex flex-col">
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <RecieptSubHeadings>
                    <Box>{headings[0]}</Box>
                  </RecieptSubHeadings>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows[0].map((row) => (
                  <TableRow key={row["name"]} xs={10}>
                    <StyledTableRow align="left" style={{ width: 260 }}>
                      {row["name"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 215 }}>
                      {row["trial"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 215 }}>
                      {row["basic"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 185 }}>
                      {row["pro"]}
                    </StyledTableRow>
                    <StyledTableRow>{row["enterprise"]}</StyledTableRow>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <RecieptSubHeadings>
                    <Box>{headings[1]}</Box>
                  </RecieptSubHeadings>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows[1].map((row) => (
                  <TableRow key={row["name"]}>
                    <StyledTableRow align="left" style={{ width: 220 }}>
                      {row["name"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["trial"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["basic"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["pro"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 205 }}>
                      {row["enterprise"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <RecieptSubHeadings>
                    <Box>{headings[2]}</Box>
                  </RecieptSubHeadings>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows[2].map((row) => (
                  <TableRow key={row["name"]}>
                    <StyledTableRow align="left" style={{ width: 220 }}>
                      {row["name"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["trial"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["basic"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["pro"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 205 }}>
                      {row["enterprise"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </StyledTableRow>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <RecieptSubHeadings>
                    <Box>{headings[3]}</Box>
                  </RecieptSubHeadings>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows[3].map((row) => (
                  <TableRow key={row["name"]}>
                    <StyledTableRow align="left" style={{ width: 230 }}>
                      {row["name"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["trial"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["basic"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 190 }}>
                      {row["pro"]}
                    </StyledTableRow>
                    <StyledTableRow align="left" style={{ width: 240 }}>
                      {row["enterprise"]}
                    </StyledTableRow>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    </Dashboard>
  );
};

export default Pricing;

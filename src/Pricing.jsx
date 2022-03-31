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
import { Class, Unsubscribe } from "@material-ui/icons";
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
import { useHistory } from "react-router-dom";
import trialLogo from "./icons/trial_logo.png";
import basicLogo from "./icons/basic_logo.png";
import proLogo from "./icons/pro_logo.png";
import enterpriseLogo from "./icons/enterprise_logo.png";
import tickLogo from "./icons/tick_logo.png";
import crossLogo from "./icons/cross_logo.png";
import Switch from "@mui/material/Switch";
import routes, { generateRoute } from "./shared/routes";
import BillingPage from "./BillingPage";
import ProductDetails from "./ProjectPayment/ProductDetails";
import selectedTypeButton from "./ProjectPayment/ProjectPayment2";
import { getAccessToken } from "./shared/storage";

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
  const { data } = await client.get(endpoint.products2);
  // priceIDFinder(data);
  // console.log(data);
  return data;
};
// const unSubscribePlan = async () => {
//   const { data } = await client.post(endpoint.unSubscribe);
//   // priceIDFinder(data);
//   // console.log(data);
//   return data;
// };
const userProfile = async () => {
  try {
    const { data } = await client.get(endpoint.userProfile);
    // console.log(data);
    return data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const usePricingData = () => {
  return useQuery([queries.products], pricingData, {
    refetchOnWindowFocus: false,
  });
};

export const useUserProfile = () => {
  return useQuery([queries.userProfile], userProfile, {
    refetchOnWindowFocus: false,
  });
};

function BillSection(headings, rows, headingIcon) {
  const classes = useStyles();
}

const Pricing = () => {
  const history = useHistory();
  const acc_token = getAccessToken();
  var dataTransferTemp = [[], [], []];
  var dataTransferTemp2AC = [[], [], []];
  var dataTransferTemp3C = [[], [], []];
  var dataTransferTemp4V = [[], [], []];
  const [durationMY, setDurationMY] = React.useState(false);

  const [trialButton, setTrialButton] = React.useState("SUBSCRIBE");
  const [basicButton, setBasicButton] = React.useState("SUBSCRIBE");
  const [proButton, setProButton] = React.useState("SUBSCRIBE");
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
  // const [tiersState, setTiersState] = React.useState();

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

  const handleClick = (title, price) => {
    // console.log("hii");
    // selectedTypeButton();
    // console.log(title);
    // history.push(routes.payment);
    history.push({
      pathname: routes.payment,
      // search: title,
      state: { type: title, duration: durationMY, price: price },
    });
  };

  const { data: pricing_data } = usePricingData();
  const { data: userProfile_data } = useUserProfile();
  // const { data: unsubscribe_data } = useUnSubscribeData();
  var alreadySubscribed;

  if (userProfile_data != undefined) {
    // console.log(userProfile_data["subscribed_product"]);
    if (userProfile_data["subscribed_product"] == "") {
      // setTrialButton("Currently Subscribed");
      alreadySubscribed = "Trial";
    } else if (
      userProfile_data["subscribed_product"] ==
        "price_1KbgSaDXX1U3xHmP8Jac0qNX" ||
      userProfile_data["subscribed_product"] == "price_1KbgKaDXX1U3xHmPYs8KuyFV"
    ) {
      // console.log("entered");
      // setBasicButton("Currently Subscribed");
      alreadySubscribed = "Basic";
    } else if (
      userProfile_data["subscribed_product"] ==
        "price_1KbgTiDXX1U3xHmPCHjkKqGN" ||
      userProfile_data["subscribed_product"] == "price_1KbgTiDXX1U3xHmPOwGrKyBp"
    ) {
      // setProButton("Currently Subscribed");
      alreadySubscribed = "Pro";
    }
  }

  // console.log(alreadySubscribed);
  if (alreadySubscribed == "Basic") {
    tiers[1]["buttonText"] = "Currently Subscribed";
  }
  if (alreadySubscribed == "Pro") {
    tiers[2]["buttonText"] = "Currently Subscribed";
  }
  if (alreadySubscribed == "Trial") {
    tiers[0]["buttonText"] = "Currently Subscribed";
  }

  if (!_.isEmpty(pricing_data?.products)) {
    // console.log(pricing_data["products"]);

    pricing_data["products"].map((item, index) => {
      // for (let i = 1; i < 3; i++) {
      //   if (!_.isEmpty(item["stripe"])) {
      if (durationMY == false) {
        tiers[1]["price"] =
          pricing_data["products"][0]["stripe"][0]["plan_price"];
        tiers[2]["price"] =
          pricing_data["products"][1]["stripe"][1]["plan_price"];
      }
      if (durationMY == true) {
        tiers[1]["price"] =
          pricing_data["products"][0]["stripe"][1]["plan_price"];
        tiers[2]["price"] =
          pricing_data["products"][1]["stripe"][0]["plan_price"];
      }
      // setTiersState(tiers);

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
  const handleUnsubscribe = async () => {
    const { UnsubscribeData } = await client.post(endpoint.unSubscribe, {
      headers: {
        Authorization: acc_token,
      },
      // timeout: 480000,
    });
    history.push(routes.pricing);
    // userProfileUpdateCheck();
  };
  const classes = useStyles();
  function handleSwitchChange(event) {
    setDurationMY(event.target.checked);
    if (durationMY == false) {
      document.getElementById("yr").style.color = "blue";
      document.getElementById("mo").style.color = "black";
    } else if (durationMY == true) {
      document.getElementById("yr").style.color = "black";
      document.getElementById("mo").style.color = "blue";
    }
  }

  return (
    <Dashboard selectedIndex={3}>
      <div className="flex flex-col items-center justify-center ">
        {" "}
        <div className="flex flex-col w-3/4 items-center justify-center  h-full">
          <div id="heading" className="container mx-auto py-4">
            {" "}
            <h1 className="text-center">
              The Right Pricing Plan for Your Business
            </h1>
          </div>

          <div id="durationMY" className="container mx-auto py-4 ">
            <div className="flex justify-center ">
              {" "}
              {/* <Button
              variant="outlined"
              color="primary"
              sx={{ border: "2px solid", borderRadius: 28 }}
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
            </Button> */}
              <div id="mo" className="mt-1.5 text-blue-500">
                Monthly
              </div>
              <Switch
                color="default"
                checked={durationMY}
                onChange={handleSwitchChange}
              />
              <div id="yr" className="mt-1.5 text-black-500">
                Yearly
              </div>
            </div>
          </div>

          <div id="pricingTypeCards" className="container mx-auto   p-2 ">
            <div className="grid grid-cols-5 gap-5   ">
              <Grid>
                <Button onClick={handleUnsubscribe}>unsubscribe</Button>
              </Grid>
              {tiers.map((tier, index) => (
                <Grid
                  item
                  key={tier.title}
                  // xs={5}
                  // sm={tier.title === "Enterprise" ? 12 : 6}
                  // md={3}
                >
                  <Card className="flex flex-col h-full self-center">
                    <div className="flex justify-center ...">
                      {" "}
                      <img src={tier.logo} alt="logo" />
                    </div>

                    <CardHeader
                      title={tier.title}
                      titleTypographyProps={{ align: "center" }}
                    />
                    <CardContent className="flex flex-col">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <Typography
                          // action={
                          //   tier.title === "Enterprise"
                          //     ? (component = "h4")
                          //     : (component = "h4")
                          // }
                          component="h4"
                          variant="h6"
                          color="#2FDAA1"
                        >
                          ${tier.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          {index != 3 &&
                            (durationMY ? <div>/yr</div> : <div>/mo</div>)}
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
                        onClick={() => {
                          handleClick(tier["title"], tier["price"]);
                        }}
                        fullWidth
                        variant={tier.buttonVariant}
                      >
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </div>
          </div>

          <div id="pricingDataTables" className="container mx-auto   p-2 ">
            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4 className="px-2" align="left">
                  {headings[0]}
                </h4>
              </div>
              <div className="grid grid-cols-5 pt-2 gap-4">
                <Grid item>
                  {rows[0].map((row) => (
                    <h6 className=" px-2 py-1" align="left">
                      {row["name"]}
                    </h6>
                  ))}
                </Grid>
                <Grid item>
                  {rows[0].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["trial"]}
                    </div>
                  ))}
                </Grid>

                <Grid item>
                  {rows[0].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["basic"]}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[0].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["pro"]}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[0].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["enterprise"]}
                    </div>
                  ))}
                </Grid>
              </div>

              {/* </TableBody> */}
            </Card>

            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4 className="px-2" align="left">
                  {headings[1]}
                </h4>
              </div>
              <div className="grid grid-cols-5 pt-2  gap-4">
                <Grid item>
                  {rows[1].map((row) => (
                    <h6 className=" px-2 py-1" v align="left">
                      {row["name"]}
                    </h6>
                  ))}
                </Grid>
                <Grid item>
                  {rows[1].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["trial"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>

                <Grid item>
                  {rows[1].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["basic"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[1].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["pro"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[1].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["enterprise"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
              </div>
            </Card>

            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4 className="px-2" align="left">
                  {headings[2]}
                </h4>
              </div>
              <div className="grid grid-cols-5 pt-2  gap-4">
                <Grid item>
                  {rows[2].map((row) => (
                    <h6 className="px-2 py-1" align="left">
                      {row["name"]}
                    </h6>
                  ))}
                </Grid>
                <Grid item>
                  {rows[2].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["trial"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>

                <Grid item>
                  {rows[2].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["basic"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[2].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["pro"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[2].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {" "}
                      {row["enterprise"] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
              </div>
            </Card>

            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4 className="px-2" align="left">
                  {headings[3]}
                </h4>
              </div>
              <div className="grid grid-cols-5 pt-2  gap-4">
                <Grid item>
                  {rows[3].map((row) => (
                    <h6 className=" px-2 py-1" align="left">
                      {row["name"]}
                    </h6>
                  ))}
                </Grid>
                <Grid item>
                  {rows[3].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["trial"]}
                    </div>
                  ))}
                </Grid>

                <Grid item>
                  {rows[3].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["basic"]}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[3].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["pro"]}
                    </div>
                  ))}
                </Grid>
                <Grid item>
                  {rows[3].map((row) => (
                    <div className=" px-2 py-1" align="center">
                      {row["enterprise"]}
                    </div>
                  ))}
                </Grid>
              </div>

              {/* </TableBody> */}
            </Card>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Pricing;

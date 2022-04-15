import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import Dashboard from './Dashboard';
import { ReactComponent as BestValueIcon } from './static/images/BestValue.svg';
import Box from '@mui/material/Box';
import client, { endpoint } from './shared/network/client';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { queries } from './shared/network/queryClient';
import Grid from '@mui/material/Grid';
import { useQuery } from 'react-query';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom';
import trialLogo from './icons/trial_logo.png';
import basicLogo from './icons/basic_logo.png';
import proLogo from './icons/pro_logo.png';
import enterpriseLogo from './icons/enterprise_logo.png';
import tickLogo from './icons/tick_logo.png';
import crossLogo from './icons/cross_logo.png';
import Switch from '@mui/material/Switch';
import routes from './shared/routes';
import { getAccessToken } from './shared/storage';
const acc_token = getAccessToken();
const pricingData = async () => {
  const { data } = await client.get(endpoint.products2);
  return data;
};
const userProfile = async () => {
  try {
    const { data } = await client.get(endpoint.userProfile, {
      headers: {
        Authorization: acc_token,
      },
    });

    return data;
  } catch (error) {}
};
export const usePricingData = () => {
  return useQuery([queries.products], pricingData, {
    refetchOnWindowFocus: false,
  });
};

const Pricing = () => {
  const history = useHistory();
  var dataTransferTemp = [[], [], []];
  var dataTransferTemp2AC = [[], [], []];
  var dataTransferTemp3C = [[], [], []];
  var dataTransferTemp4V = [[], [], []];
  const headings = ['PROJECTS', 'API LIFECYCLE', 'CONNECTORS', 'VALIDITY'];
  const rows = [
    [
      {
        name: 'No. of API Design',
        trial: '',
        basic: '',
        pro: '',
        enterprise: 'unlimited',
      },
      {
        name: 'No. of Republish',
        trial: '',
        basic: '',
        pro: '',
        enterprise: 'unlimited',
      },

      {
        name: 'No. of Creator Licenses',
        trial: '',
        basic: '',
        pro: '',
        enterprise: 'unlimited',
      },

      {
        name: 'No. of Collaborators',
        trial: '',
        basic: '',
        pro: '',
        enterprise: 'unlimited',
      },
    ],
    [
      {
        name: 'Specs',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'Code',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },

      {
        name: 'Mock',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },

      {
        name: 'Test Data',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'Functional Test',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'Performance Test',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'Security Test',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
    ],
    [
      {
        name: 'MS SQL Server',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'Postgres',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
      {
        name: 'MYSQL',
        trial: '',
        basic: '',
        pro: '',
        enterprise: true,
      },
    ],
    [
      {
        name: 'Validity',
        trial: '',
        basic: '',
        pro: '',
        enterprise: 'Contract Based',
      },
    ],
  ];
  const [durationMY, setDurationMY] = React.useState(false);

  const [trialButton, setTrialButton] = React.useState('SUBSCRIBE');
  const [basicButton, setBasicButton] = React.useState('SUBSCRIBE');
  const [proButton, setProButton] = React.useState('SUBSCRIBE');
  const tiers = [
    {
      title: 'Trial',
      price: '0',
      description: ['Get the Trial, free'],
      logo: trialLogo,
      buttonText: trialButton,
      buttonVariant: 'outlined',
    },
    {
      title: 'Basic',
      price: '15',
      description: ['Everything in Trial +'],
      buttonText: basicButton,
      buttonVariant: 'outlined',
      logo: basicLogo,
    },
    {
      title: 'Pro',
      price: '30',
      description: ['Everything in Basic +'],
      buttonText: proButton,
      buttonVariant: 'outlined',
      logo: proLogo,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: ['Everything in Pro +'],
      buttonText: 'CONTACT US',
      buttonVariant: 'outlined',
      logo: enterpriseLogo,
    },
  ];

  const { data } = useQuery('userProfileKey', userProfile, {
    refetchOnWindowFocus: false,
  });
  var alreadySubscribed;
  useEffect(() => {
    if (!_.isEmpty(data)) {
      if (data?.['plan_name'] == null) {
        // setTrialButton2(false);
        setTrialButton('Expired');
        setBasicButton('Subscribe');
        setProButton('Subscribe');
      } else {
        if (data?.['subscribed_price'] == '') {
          alreadySubscribed = 'Trial';
          setTrialButton('Subscribed');
        } else {
          setTrialButton('Subscribe');
        }
        if (
          data?.['subscribed_price'] == 'price_1KbgSaDXX1U3xHmP8Jac0qNX' ||
          data?.['subscribed_price'] == 'price_1KbgKaDXX1U3xHmPYs8KuyFV'
        ) {
          setBasicButton('Subscribed');
          alreadySubscribed = 'Basic';
        } else {
          setBasicButton('Subscribe');
        }
        if (
          data?.['subscribed_price'] == 'price_1KbgTiDXX1U3xHmPCHjkKqGN' ||
          data?.['subscribed_price'] == 'price_1KbgTiDXX1U3xHmPOwGrKyBp'
        ) {
          setProButton('Subscribed');
          alreadySubscribed = 'Pro';
        } else {
          setProButton('Subscribe');
        }
      }
    }
  });

  const handleClick = (title, price, buttonTextType) => {
    if (buttonTextType == 'Subscribe') {
      history.push({
        pathname: routes.payment,
        state: { type: title, duration: durationMY, price: price },
      });
    } else if (buttonTextType == 'CONTACT US') {
      window.open('https://www.ezapi.ai/contact');
    }
  };

  const { data: pricing_data } = usePricingData();

  if (!_.isEmpty(pricing_data?.products)) {
    pricing_data['products'].map((item, index) => {
      if (durationMY == false) {
        tiers[1]['price'] =
          pricing_data?.['products']?.[0]?.['stripe']?.[0]?.['plan_price'];
        tiers[2]['price'] =
          pricing_data?.['products']?.[1]?.['stripe']?.[1]?.['plan_price'];
      }
      if (durationMY == true) {
        tiers[1]['price'] =
          pricing_data?.['products']?.[0]?.['stripe']?.[1]?.['plan_price'];
        tiers[2]['price'] =
          pricing_data?.['products']?.[1]?.['stripe']?.[0]?.['plan_price'];
      }

      dataTransferTemp[index].push(
        item['no_of_projects'],
        item['no_of_republish'],
        item['no_of_creator_licenses'],
        item['no_of_collaborators']
      );
      dataTransferTemp2AC[index].push(
        item['spec'],
        item['code'],
        item['mock'],
        item['test_data'],
        item['functional_tests'],
        item['performance_tests'],
        item['security_tests']
      );
      dataTransferTemp3C[index].push(
        item['connectors']['ms_sql'],
        item['connectors']['postgres'],
        item['connectors']['my_sql']
      );
      dataTransferTemp4V[index].push(item['validity']);
    });

    for (let i = 0; i <= 3; i++) {
      rows[0][i]['trial'] = dataTransferTemp[2][i];
      rows[0][i]['basic'] = dataTransferTemp[0][i];
      rows[0][i]['pro'] = dataTransferTemp[1][i];
    }
    for (let i = 0; i <= 6; i++) {
      rows[1][i]['trial'] = dataTransferTemp2AC[2][i];
      rows[1][i]['basic'] = dataTransferTemp2AC[0][i];
      rows[1][i]['pro'] = dataTransferTemp2AC[1][i];
    }
    for (let i = 0; i <= 2; i++) {
      rows[2][i]['trial'] = dataTransferTemp3C[2][i];
      rows[2][i]['basic'] = dataTransferTemp3C[0][i];
      rows[2][i]['pro'] = dataTransferTemp3C[1][i];
    }
    for (let i = 0; i < 1; i++) {
      rows[3][i]['trial'] = dataTransferTemp4V[2][i];
      rows[3][i]['basic'] = dataTransferTemp4V[0][i];
      rows[3][i]['pro'] = dataTransferTemp4V[1][i];
    }
  }
  // const handleUnsubscribe = async () => {
  //   const { UnsubscribeData } = await client.post(endpoint.unSubscribe, {
  //     headers: {
  //       Authorization: acc_token,
  //     },
  //   });
  //   history.push(routes.pricing);
  // };

  function handleSwitchChange(event) {
    setDurationMY(event.target.checked);
    if (durationMY == false) {
      document.getElementById('yr').style.color = '#c72c71';
      document.getElementById('mo').style.color = 'black';
    } else if (durationMY == true) {
      document.getElementById('yr').style.color = 'black';
      document.getElementById('mo').style.color = '#c72c71';
    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <Dashboard selectedIndex={3}>
      <div className="flex flex-col items-center justify-center w-full  ">
        {' '}
        <div className="flex flex-col  items-center justify-center w-full px-3 h-full">
          <div id="heading" className="container mx-auto pt-4">
            {' '}
            <h1 className=" text-customGray text-4xl font-sans font-medium tracking-wide text-center">
              The Right Pricing Plan for Your Business
            </h1>
          </div>

          <div id="durationMY" className="container mx-auto p-4 ">
            <div className="flex justify-center ">
              {' '}
              <div id="mo" style={{ color: '#c72c71' }} className="mt-1.5">
                {/* <text style={{ color: '#c72c71' }}>Monthly</text> */}
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

          <div id="pricingTypeCards1" className="container mx-auto   p-2 ">
            {durationMY ? (
              <div className="grid grid-cols-11 gap-5    ">
                <Grid className="col-start-6 col-span-2 ">
                  <div className="flex  justify-center ">
                    <BestValueIcon />
                  </div>
                </Grid>
                <Grid className="col-start-8 col-span-2 ">
                  {' '}
                  <div className="flex  justify-center ">
                    <BestValueIcon />
                  </div>
                </Grid>
              </div>
            ) : null}

            <div className="grid grid-cols-11 gap-5   ">
              <Grid className="col-span-3 ..."></Grid>
              {tiers.map((tier, index) => (
                <Grid className="col-span-2 " item key={tier.title}>
                  <Card className="flex flex-col h-full self-center">
                    <div className="flex justify-center ..."></div>
                    <div className="flex justify-center ...">
                      {' '}
                      <img src={tier.logo} alt="logo" />
                    </div>{' '}
                    <CardHeader
                      style={{
                        color:
                          index == 0
                            ? '#2FDAA1'
                            : index == 1
                            ? '#9085D3'
                            : index == 2
                            ? '#40A3E4'
                            : index == 3
                            ? '#EC6A6C'
                            : 'red',
                      }}
                      title={tier.title}
                      titleTypographyProps={{ align: 'center' }}
                    />
                    <CardContent className="flex flex-col">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'baseline',
                        }}
                      >
                        <Typography
                          component="h4"
                          variant="h6"
                          style={{
                            color:
                              index == 0
                                ? '#2FDAA1'
                                : index == 1
                                ? '#9085D3'
                                : index == 2
                                ? '#40A3E4'
                                : index == 3
                                ? '#EC6A6C'
                                : 'red',
                          }}
                        >
                          {index == 3 ? (
                            <div>{tier.price}</div>
                          ) : (
                            <div>${numberWithCommas(tier.price)}</div>
                          )}
                        </Typography>
                        <Typography
                          variant="h6"
                          style={{
                            color:
                              index == 0
                                ? '#2FDAA1'
                                : index == 1
                                ? '#9085D3'
                                : index == 2
                                ? '#40A3E4'
                                : index == 3
                                ? '#EC6A6C'
                                : '#40A3E4',
                          }}
                        >
                          {index != 3 &&
                            index != 0 &&
                            (durationMY ? <div>/yr</div> : <div>/mo</div>)}
                        </Typography>
                      </Box>
                      <ul className="flex flex-col h-3">
                        {tier.description.map((line) => (
                          <Typography
                            // component="li"
                            variant="subtitle1"
                            align="center"
                            key={line}
                            style={{
                              color:
                                index == 0
                                  ? '#2FDAA1'
                                  : index == 1
                                  ? '#9085D3'
                                  : index == 2
                                  ? '#40A3E4'
                                  : index == 3
                                  ? '#EC6A6C'
                                  : '#40A3E4',
                            }}
                          >
                            {line}
                          </Typography>
                        ))}
                      </ul>
                    </CardContent>
                    <CardActions className="flex mt-7 ">
                      <Button
                        style={{
                          color:
                            tier.buttonText == 'Subscribed'
                              ? 'white'
                              : tier.buttonText == 'Expired'
                              ? 'black'
                              : 'white',

                          background:
                            tier.buttonText == 'Subscribed'
                              ? '#c72c71'
                              : tier.buttonText == 'Expired'
                              ? '#9f9f9f'
                              : '#0971f1',
                        }}
                        onClick={() => {
                          handleClick(
                            tier['title'],
                            tier['price'],
                            tier.buttonText
                          );
                        }}
                        disabled={
                          tier.buttonText == 'Subscribed' ||
                          tier.buttonText == 'Expired'
                        }
                        fullWidth
                        variant="outlined"
                      >
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </div>
          </div>

          <div id="pricingDataTables" className="container mx-auto   px-2 ">
            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4
                  className="text-neutral-gray2 uppercase text-base tracking-normal font-bold px-2 "
                  align="left"
                >
                  {headings[0]}
                </h4>
              </div>
              <div className="grid grid-flow-row grid-cols-11 pt-2 gap-4">
                <Grid item className="col-span-3">
                  {rows[0].map((row) => (
                    <h6
                      className=" uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="left"
                    >
                      {row['name']}
                    </h6>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[0].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['trial']}
                    </div>
                  ))}
                </Grid>

                <Grid className="col-span-2" item>
                  {rows[0].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['basic']}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[0].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['pro']}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[0].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['enterprise']}
                    </div>
                  ))}
                </Grid>
              </div>
            </Card>

            <Card className="p-2 mb-3">
              <div className="bg-gray-100">
                <h4
                  className="text-neutral-gray2 uppercase text-base tracking-normal font-bold px-2"
                  align="left"
                >
                  {headings[1]}
                </h4>
              </div>
              <div className="grid grid-flow-row grid-cols-11 pt-2 gap-4">
                <Grid item className="col-span-3">
                  {rows[1].map((row) => (
                    <h6
                      className=" uppercase text-base tracking-normal font-medium px-2 py-2"
                      v
                      align="left"
                    >
                      {row['name']}
                    </h6>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[1].map((row) => (
                    <div
                      className=" uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['trial'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>

                <Grid className="col-span-2" item>
                  {rows[1].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['basic'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[1].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['pro'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[1].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['enterprise'] == true ? (
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
                <h4
                  className="text-neutral-gray2 uppercase text-base tracking-normal font-bold px-2 "
                  align="left"
                >
                  {headings[2]}
                </h4>
              </div>
              <div className="grid grid-flow-row grid-cols-11 pt-2 gap-4">
                <Grid item className="col-span-3">
                  {rows[2].map((row) => (
                    <h6
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="left"
                    >
                      {row['name']}
                    </h6>
                  ))}
                </Grid>
                <Grid item className="col-span-2">
                  {rows[2].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['trial'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>

                <Grid className="col-span-2" item>
                  {rows[2].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['basic'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[2].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['pro'] == true ? (
                        <img src={tickLogo} />
                      ) : (
                        <img src={crossLogo} />
                      )}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[2].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {' '}
                      {row['enterprise'] == true ? (
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
                <h4
                  className="text-neutral-gray2 uppercase text-base tracking-normal font-bold px-2 "
                  align="left"
                >
                  {headings[3]}
                </h4>
              </div>
              <div className="grid grid-flow-row grid-cols-11 pt-2 gap-4">
                <Grid item className="col-span-3">
                  {rows[3].map((row) => (
                    <h6
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="left"
                    >
                      {row['name']}
                    </h6>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[3].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['trial']}
                    </div>
                  ))}
                </Grid>

                <Grid className="col-span-2" item>
                  {rows[3].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['basic']}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[3].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['pro']}
                    </div>
                  ))}
                </Grid>
                <Grid className="col-span-2" item>
                  {rows[3].map((row) => (
                    <div
                      className="uppercase text-base tracking-normal font-medium px-2 py-2"
                      align="center"
                    >
                      {row['enterprise']}
                    </div>
                  ))}
                </Grid>
              </div>

              {/* </TableBody> */}
            </Card>
          </div>

          <div id="pricingTypeCards2" className="container mx-auto   px-2 ">
            <div className="grid grid-cols-11 gap-5   ">
              <Grid className="col-span-3 ..."></Grid>
              {tiers.map((tier, index) => (
                <Grid className="col-span-2 " item key={tier.title}>
                  <Card className="flex flex-col self-center">
                    <CardActions className="flex ">
                      <Button
                        style={{
                          color:
                            tier.buttonText == 'Subscribed'
                              ? 'white'
                              : tier.buttonText == 'Expired'
                              ? 'black'
                              : 'white',

                          background:
                            tier.buttonText == 'Subscribed'
                              ? '#c72c71'
                              : tier.buttonText == 'Expired'
                              ? '#9f9f9f'
                              : '#0971f1',
                        }}
                        onClick={() => {
                          handleClick(
                            tier['title'],
                            tier['price'],
                            tier.buttonText
                          );
                        }}
                        disabled={
                          tier.buttonText == 'Subscribed' ||
                          tier.buttonText == 'Expired'
                        }
                        fullWidth
                        variant="outlined"
                      >
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                    <CardHeader
                      style={{
                        color:
                          index == 0
                            ? '#2FDAA1'
                            : index == 1
                            ? '#9085D3'
                            : index == 2
                            ? '#40A3E4'
                            : index == 3
                            ? '#EC6A6C'
                            : 'red',
                      }}
                      title={tier.title}
                      titleTypographyProps={{ align: 'center' }}
                    />
                    <CardContent className="flex flex-col ">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'baseline',
                        }}
                      >
                        <Typography
                          component="h4"
                          variant="h6"
                          style={{
                            color:
                              index == 0
                                ? '#2FDAA1'
                                : index == 1
                                ? '#9085D3'
                                : index == 2
                                ? '#40A3E4'
                                : index == 3
                                ? '#EC6A6C'
                                : 'red',
                          }}
                        >
                          {index == 3 ? (
                            <div>{tier.price}</div>
                          ) : (
                            <div>${numberWithCommas(tier.price)}</div>
                          )}
                        </Typography>
                        <Typography
                          variant="h6"
                          style={{
                            color:
                              index == 0
                                ? '#2FDAA1'
                                : index == 1
                                ? '#9085D3'
                                : index == 2
                                ? '#40A3E4'
                                : index == 3
                                ? '#EC6A6C'
                                : '#40A3E4',
                          }}
                        >
                          {index != 3 &&
                            index != 0 &&
                            (durationMY ? <div>/yr</div> : <div>/mo</div>)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Pricing;

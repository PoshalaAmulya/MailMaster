// import React, { useState } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ButtonGroup,
//   ProgressBar,
// } from 'react-bootstrap';
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faEnvelope,
//   faEye,
//   faMousePointer,
//   faBan,
//   faChartLine,
//   faCalendarAlt,
//   faDownload,
// } from '@fortawesome/free-solid-svg-icons';

// // Sample data - replace with API calls
// const monthlyData = [
//   { month: 'Jan', sent: 12500, opened: 8750, clicked: 3750, bounced: 250 },
//   { month: 'Feb', sent: 15000, opened: 10500, clicked: 4500, bounced: 300 },
//   { month: 'Mar', sent: 18000, opened: 13500, clicked: 6300, bounced: 360 },
//   { month: 'Apr', sent: 16000, opened: 11200, clicked: 4800, bounced: 320 },
//   { month: 'May', sent: 21000, opened: 15750, clicked: 7350, bounced: 420 },
//   { month: 'Jun', sent: 24000, opened: 18000, clicked: 8400, bounced: 480 },
// ];

// const deviceData = [
//   { name: 'Mobile', value: 55 },
//   { name: 'Desktop', value: 35 },
//   { name: 'Tablet', value: 10 },
// ];

// const timeData = [
//   { time: '6am', opens: 120 },
//   { time: '9am', opens: 750 },
//   { time: '12pm', opens: 1250 },
//   { time: '3pm', opens: 850 },
//   { time: '6pm', opens: 450 },
//   { time: '9pm', opens: 200 },
// ];

// const engagementData = [
//   { name: 'Highly Engaged', value: 30 },
//   { name: 'Engaged', value: 45 },
//   { name: 'Occasional', value: 15 },
//   { name: 'At Risk', value: 10 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// const DEVICE_COLORS = ['#00C49F', '#0088FE', '#FFBB28'];

// function Analytics() {
//   const [timeRange, setTimeRange] = useState('month');

//   const calculateMetrics = () => {
//     const latest = monthlyData[monthlyData.length - 1];
//     return {
//       openRate: ((latest.opened / latest.sent) * 100).toFixed(1),
//       clickRate: ((latest.clicked / latest.opened) * 100).toFixed(1),
//       bounceRate: ((latest.bounced / latest.sent) * 100).toFixed(1),
//       deliveryRate: (((latest.sent - latest.bounced) / latest.sent) * 100).toFixed(1),
//     };
//   };

//   const metrics = calculateMetrics();

//   return (
//     <Container fluid className="px-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="mb-1">Analytics Dashboard</h2>
//           <p className="text-muted mb-0">Track your email campaign performance</p>
//         </div>
//         <div className="d-flex gap-2">
//           <ButtonGroup>
//             <Button
//               variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('week')}
//             >
//               Week
//             </Button>
//             <Button
//               variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('month')}
//             >
//               Month
//             </Button>
//             <Button
//               variant={timeRange === 'year' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('year')}
//             >
//               Year
//             </Button>
//           </ButtonGroup>
//           <Button variant="outline-primary">
//             <FontAwesomeIcon icon={faDownload} className="me-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <Row className="g-4 mb-4">
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-primary text-primary rounded-3 p-3">
//                   <FontAwesomeIcon icon={faEnvelope} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Delivery Rate</h6>
//                   <h3 className="mb-0">{metrics.deliveryRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.deliveryRate} variant="primary" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-success text-success rounded-3 p-3">
//                   <FontAwesomeIcon icon={faEye} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Open Rate</h6>
//                   <h3 className="mb-0">{metrics.openRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.openRate} variant="success" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-info text-info rounded-3 p-3">
//                   <FontAwesomeIcon icon={faMousePointer} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Click Rate</h6>
//                   <h3 className="mb-0">{metrics.clickRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.clickRate} variant="info" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-danger text-danger rounded-3 p-3">
//                   <FontAwesomeIcon icon={faBan} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Bounce Rate</h6>
//                   <h3 className="mb-0">{metrics.bounceRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.bounceRate} variant="danger" />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts */}
//       <Row className="g-4 mb-4">
//         <Col md={8}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Email Performance Trends</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={monthlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="sent"
//                     stroke="#8884d8"
//                     name="Sent"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="opened"
//                     stroke="#82ca9d"
//                     name="Opened"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="clicked"
//                     stroke="#ffc658"
//                     name="Clicked"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Device Distribution</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={deviceData}
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {deviceData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="g-4">
//         <Col md={6}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Best Time to Send</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="opens"
//                     stroke="#8884d8"
//                     fill="#8884d8"
//                     name="Opens"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Subscriber Engagement</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={engagementData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8884d8">
//                     {engagementData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <style>
//         {`
//           .icon-shape {
//             width: 48px;
//             height: 48px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
//           .bg-light-primary {
//             background-color: rgba(13, 110, 253, 0.1);
//           }
//           .bg-light-success {
//             background-color: rgba(25, 135, 84, 0.1);
//           }
//           .bg-light-info {
//             background-color: rgba(13, 202, 240, 0.1);
//           }
//           .bg-light-danger {
//             background-color: rgba(220, 53, 69, 0.1);
//           }
//           .progress {
//             height: 4px;
//           }
//         `}
//       </style>
//     </Container>
//   );
// }

// export default Analytics; 
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ButtonGroup,
//   ProgressBar,
// } from 'react-bootstrap';
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faEnvelope,
//   faEye,
//   faMousePointer,
//   faBan,
//   faChartLine,
//   faCalendarAlt,
//   faDownload,
// } from '@fortawesome/free-solid-svg-icons';

// // Sample data - replace with API calls
// const monthlyData = [
//   { month: 'Jan', sent: 12500, opened: 8750, clicked: 3750, bounced: 250 },
//   { month: 'Feb', sent: 15000, opened: 10500, clicked: 4500, bounced: 300 },
//   { month: 'Mar', sent: 18000, opened: 13500, clicked: 6300, bounced: 360 },
//   { month: 'Apr', sent: 16000, opened: 11200, clicked: 4800, bounced: 320 },
//   { month: 'May', sent: 21000, opened: 15750, clicked: 7350, bounced: 420 },
//   { month: 'Jun', sent: 24000, opened: 18000, clicked: 8400, bounced: 480 },
// ];

// const deviceData = [
//   { name: 'Mobile', value: 55 },
//   { name: 'Desktop', value: 35 },
//   { name: 'Tablet', value: 10 },
// ];

// const timeData = [
//   { time: '6am', opens: 120 },
//   { time: '9am', opens: 750 },
//   { time: '12pm', opens: 1250 },
//   { time: '3pm', opens: 850 },
//   { time: '6pm', opens: 450 },
//   { time: '9pm', opens: 200 },
// ];

// const engagementData = [
//   { name: 'Highly Engaged', value: 30 },
//   { name: 'Engaged', value: 45 },
//   { name: 'Occasional', value: 15 },
//   { name: 'At Risk', value: 10 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// const DEVICE_COLORS = ['#00C49F', '#0088FE', '#FFBB28'];

// function Analytics() {
//   const [timeRange, setTimeRange] = useState('month');

//   const calculateMetrics = () => {
//     const latest = monthlyData[monthlyData.length - 1];
//     return {
//       openRate: ((latest.opened / latest.sent) * 100).toFixed(1),
//       clickRate: ((latest.clicked / latest.opened) * 100).toFixed(1),
//       bounceRate: ((latest.bounced / latest.sent) * 100).toFixed(1),
//       deliveryRate: (((latest.sent - latest.bounced) / latest.sent) * 100).toFixed(1),
//     };
//   };

//   const metrics = calculateMetrics();

//   return (
//     <Container fluid className="px-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="mb-1">Analytics Dashboard</h2>
//           <p className="text-muted mb-0">Track your email campaign performance</p>
//         </div>
//         <div className="d-flex gap-2">
//           <ButtonGroup>
//             <Button
//               variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('week')}
//             >
//               Week
//             </Button>
//             <Button
//               variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('month')}
//             >
//               Month
//             </Button>
//             <Button
//               variant={timeRange === 'year' ? 'primary' : 'outline-primary'}
//               onClick={() => setTimeRange('year')}
//             >
//               Year
//             </Button>
//           </ButtonGroup>
//           <Button variant="outline-primary">
//             <FontAwesomeIcon icon={faDownload} className="me-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <Row className="g-4 mb-4">
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-primary text-primary rounded-3 p-3">
//                   <FontAwesomeIcon icon={faEnvelope} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Delivery Rate</h6>
//                   <h3 className="mb-0">{metrics.deliveryRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.deliveryRate} variant="primary" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-success text-success rounded-3 p-3">
//                   <FontAwesomeIcon icon={faEye} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Open Rate</h6>
//                   <h3 className="mb-0">{metrics.openRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.openRate} variant="success" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-info text-info rounded-3 p-3">
//                   <FontAwesomeIcon icon={faMousePointer} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Click Rate</h6>
//                   <h3 className="mb-0">{metrics.clickRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.clickRate} variant="info" />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="icon-shape bg-light-danger text-danger rounded-3 p-3">
//                   <FontAwesomeIcon icon={faBan} />
//                 </div>
//                 <div className="text-end">
//                   <h6 className="text-muted mb-1">Bounce Rate</h6>
//                   <h3 className="mb-0">{metrics.bounceRate}%</h3>
//                 </div>
//               </div>
//               <ProgressBar now={metrics.bounceRate} variant="danger" />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts */}
//       <Row className="g-4 mb-4">
//         <Col md={8}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Email Performance Trends</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={monthlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="sent"
//                     stroke="#8884d8"
//                     name="Sent"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="opened"
//                     stroke="#82ca9d"
//                     name="Opened"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="clicked"
//                     stroke="#ffc658"
//                     name="Clicked"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Device Distribution</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={deviceData}
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {deviceData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="g-4">
//         <Col md={6}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Best Time to Send</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="opens"
//                     stroke="#8884d8"
//                     fill="#8884d8"
//                     name="Opens"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="h-100">
//             <Card.Body>
//               <h5 className="mb-4">Subscriber Engagement</h5>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={engagementData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8884d8">
//                     {engagementData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <style>
//         {`
//           .icon-shape {
//             width: 48px;
//             height: 48px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
//           .bg-light-primary {
//             background-color: rgba(13, 110, 253, 0.1);
//           }
//           .bg-light-success {
//             background-color: rgba(25, 135, 84, 0.1);
//           }
//           .bg-light-info {
//             background-color: rgba(13, 202, 240, 0.1);
//           }
//           .bg-light-danger {
//             background-color: rgba(220, 53, 69, 0.1);
//           }
//           .progress {
//             height: 4px;
//           }
//         `}
//       </style>
//     </Container>
//   );
// }

// export default Analytics; 
 
 
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  ProgressBar,
} from 'react-bootstrap';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faEye,
  faMousePointer,
  faBan,
  faChartLine,
  faCalendarAlt,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

// Sample data - replace with API calls
const monthlyData = [
  { month: 'Jan', sent: 12500, opened: 8750, clicked: 3750, bounced: 250 },
  { month: 'Feb', sent: 15000, opened: 10500, clicked: 4500, bounced: 300 },
  { month: 'Mar', sent: 18000, opened: 13500, clicked: 6300, bounced: 360 },
  { month: 'Apr', sent: 16000, opened: 11200, clicked: 4800, bounced: 320 },
  { month: 'May', sent: 21000, opened: 15750, clicked: 7350, bounced: 420 },
  { month: 'Jun', sent: 24000, opened: 18000, clicked: 8400, bounced: 480 },
];

const deviceData = [
  { name: 'Mobile', value: 55 },
  { name: 'Desktop', value: 35 },
  { name: 'Tablet', value: 10 },
];

const timeData = [
  { time: '6am', opens: 120 },
  { time: '9am', opens: 750 },
  { time: '12pm', opens: 1250 },
  { time: '3pm', opens: 850 },
  { time: '6pm', opens: 450 },
  { time: '9pm', opens: 200 },
];

const engagementData = [
  { name: 'Highly Engaged', value: 30 },
  { name: 'Engaged', value: 45 },
  { name: 'Occasional', value: 15 },
  { name: 'At Risk', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const DEVICE_COLORS = ['#00C49F', '#0088FE', '#FFBB28'];

function Analytics() {
  const [timeRange, setTimeRange] = useState('month');

  const calculateMetrics = () => {
    const latest = monthlyData[monthlyData.length - 1];
    return {
      openRate: ((latest.opened / latest.sent) * 100).toFixed(1),
      clickRate: ((latest.clicked / latest.opened) * 100).toFixed(1),
      bounceRate: ((latest.bounced / latest.sent) * 100).toFixed(1),
      deliveryRate: (((latest.sent - latest.bounced) / latest.sent) * 100).toFixed(1),
    };
  };

  const metrics = calculateMetrics();

  return (
    <Container fluid className="px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Analytics Dashboard</h2>
          <p className="text-muted mb-0">Track your email campaign performance</p>
        </div>
        <div className="d-flex gap-2">
          <ButtonGroup>
            <Button
              variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'year' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </ButtonGroup>
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="icon-shape bg-light-primary text-primary rounded-3 p-3">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Delivery Rate</h6>
                  <h3 className="mb-0">{metrics.deliveryRate}%</h3>
                </div>
              </div>
              <ProgressBar now={metrics.deliveryRate} variant="primary" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="icon-shape bg-light-success text-success rounded-3 p-3">
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Open Rate</h6>
                  <h3 className="mb-0">{metrics.openRate}%</h3>
                </div>
              </div>
              <ProgressBar now={metrics.openRate} variant="success" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="icon-shape bg-light-info text-info rounded-3 p-3">
                  <FontAwesomeIcon icon={faMousePointer} />
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Click Rate</h6>
                  <h3 className="mb-0">{metrics.clickRate}%</h3>
                </div>
              </div>
              <ProgressBar now={metrics.clickRate} variant="info" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="icon-shape bg-light-danger text-danger rounded-3 p-3">
                  <FontAwesomeIcon icon={faBan} />
                </div>
                <div className="text-end">
                  <h6 className="text-muted mb-1">Bounce Rate</h6>
                  <h3 className="mb-0">{metrics.bounceRate}%</h3>
                </div>
              </div>
              <ProgressBar now={metrics.bounceRate} variant="danger" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Email Performance Trends</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#8884d8"
                    name="Sent"
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="#82ca9d"
                    name="Opened"
                  />
                  <Line
                    type="monotone"
                    dataKey="clicked"
                    stroke="#ffc658"
                    name="Clicked"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Device Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Best Time to Send</h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="opens"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Opens"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Subscriber Engagement</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {engagementData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .icon-shape {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bg-light-primary {
            background-color: rgba(13, 110, 253, 0.1);
          }
          .bg-light-success {
            background-color: rgba(25, 135, 84, 0.1);
          }
          .bg-light-info {
            background-color: rgba(13, 202, 240, 0.1);
          }
          .bg-light-danger {
            background-color: rgba(220, 53, 69, 0.1);
          }
          .progress {
            height: 4px;
          }
        `}
      </style>
    </Container>
  );
}

export default Analytics;
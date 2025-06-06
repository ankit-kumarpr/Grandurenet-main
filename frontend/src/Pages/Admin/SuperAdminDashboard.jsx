import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip
} from '@mui/material';
import PageTitle from '../../components/PageTitle';
import axios from 'axios';
import {
  People,
  AdminPanelSettings,
  Feedback,
  Person,
  Email,
  Phone,
  DateRange,
  BugReport,
  Code,
  DesignServices,
  Videocam
} from '@mui/icons-material';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        GetUserData(),
        GetAdminData(),
        FeedBackListAPI()
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const GetAdminData = async () => {
    try {
      const url = `https://grandurenet-main.onrender.com/api/user/getalladmin`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(url, { headers });
      setAdmins(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const GetUserData = async () => {
    try {
      const url = `https://grandurenet-main.onrender.com/api/user/alluserlist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(url, { headers });
      setUsers(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const FeedBackListAPI = async () => {
    try {
      const url = `https://grandurenet-main.onrender.com/api/user/feedbacks`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.get(url, { headers });
      setFeedbacks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <BugReport fontSize="small" />;
      case 'Feature': return <Code fontSize="small" />;
      case 'UI/UX': return <DesignServices fontSize="small" />;
      case 'Live Session': return <Videocam fontSize="small" />;
      default: return <Feedback fontSize="small" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <PageTitle page={"Super admin dashboard"} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <People color="primary" sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h4">{users.length}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <AdminPanelSettings color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Total Admins</Typography>
                        <Typography variant="h4">{admins.length}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Feedback color="warning" sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Total Feedbacks</Typography>
                        <Typography variant="h4">{feedbacks.length}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Users Table */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Recent Users ({users.slice(0, 5).length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Person sx={{ mr: 1 }} />
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Email sx={{ mr: 1, fontSize: 16 }} />
                                {user.email}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Phone sx={{ mr: 1, fontSize: 16 }} />
                                {user.phone || 'N/A'}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <DateRange sx={{ mr: 1, fontSize: 16 }} />
                                {formatDate(user.createdAt)}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Recent Admins Table */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Recent Admins ({admins.slice(0, 5).length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {admins.slice(0, 5).map((admin) => (
                          <TableRow key={admin._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <AdminPanelSettings sx={{ mr: 1 }} />
                                {admin.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Email sx={{ mr: 1, fontSize: 16 }} />
                                {admin.email}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Phone sx={{ mr: 1, fontSize: 16 }} />
                                {admin.phone || 'N/A'}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <DateRange sx={{ mr: 1, fontSize: 16 }} />
                                {formatDate(admin.createdAt)}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Recent Feedbacks Table */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Recent Feedbacks ({feedbacks.slice(0, 5).length})
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Group/Session</TableCell>
                          <TableCell>Submitted By</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {feedbacks.slice(0, 5).map((feedback) => (
                          <TableRow key={feedback._id}>
                            <TableCell>
                              <Chip 
                                icon={getTypeIcon(feedback.type)}
                                label={feedback.type}
                                color={
                                  feedback.type === 'Bug' ? 'error' :
                                  feedback.type === 'Feature' ? 'success' :
                                  feedback.type === 'UI/UX' ? 'info' : 'warning'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {feedback.message}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {feedback.group?.groupname || feedback.session || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {feedback.user?.name || 'Anonymous'}
                            </TableCell>
                            <TableCell>
                              {formatDate(feedback.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default SuperAdminDashboard;

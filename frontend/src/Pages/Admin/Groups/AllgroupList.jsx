import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Box,
  Stack,
  Button,
  Skeleton,
  Avatar,
  Paper,
  Alert
} from '@mui/material';
import {
  Group,
  Lock,
  LockOpen,
  Chat,
  DoNotDisturbOn,
  Message
} from '@mui/icons-material';
import PageTitle from '../../../components/PageTitle';

const AllgroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = sessionStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    GroupListAPI();
  }, []);

  const GroupListAPI = async () => {
    try {
      setLoading(true);
      const url = `https://grandurenet-main.onrender.com/api/user/grouplist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.get(url, { headers });
      
      if (response.data.error) {
        setGroups(response.data.data || []);
      } else {
        setGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStartChat = (groupId) => {
    navigate(`/join-session/${groupId}`);
  };

  return (
    <>
      <PageTitle page={"All Groups"} />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={30} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                    <Skeleton variant="text" width="80%" height={30} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : groups.length > 0 ? (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={group._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {group.groupname}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          icon={
                            group.grouptype === "public" ? (
                              <LockOpen fontSize="small" />
                            ) : (
                              <Lock fontSize="small" />
                            )
                          }
                          label={
                            group.grouptype === "public" ? "Public" : "Private"
                          }
                          size="small"
                          color={
                            group.grouptype === "public"
                              ? "primary"
                              : "secondary"
                          }
                        />
                        <Chip
                          icon={
                            group.chat === "enabled" ? (
                              <Chat fontSize="small" />
                            ) : (
                              <DoNotDisturbOn fontSize="small" />
                            )
                          }
                          label={
                            group.chat === "enabled" ? "Chat On" : "Chat Off"
                          }
                          size="small"
                          color={group.chat === "enabled" ? "success" : "error"}
                        />
                      </Stack>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Created: {formatDate(group.createdAt)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Members: {group.users?.length || 0}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Message />}
                      onClick={() => handleStartChat(group._id)}
                      disabled={group.chat !== "enabled"}
                      sx={{
                        backgroundColor: group.chat === "enabled" ? 'primary.main' : 'grey.500',
                        '&:hover': {
                          backgroundColor: group.chat === "enabled" ? 'primary.dark' : 'grey.600'
                        }
                      }}
                    >
                      {group.chat === "enabled" ? "Start Chat" : "Chat Disabled"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <Group sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Groups Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There are currently no groups to display.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default AllgroupList;

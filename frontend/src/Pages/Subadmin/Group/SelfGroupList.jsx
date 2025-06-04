import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Box,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Button
} from '@mui/material';
import {
  Group,
  Lock,
  LockOpen,
  Chat,
  DoNotDisturbOn,
  Person,
  Message
} from '@mui/icons-material';


const SelfGroupList = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    GetYourgroupsList();
  }, []);

  const GetYourgroupsList = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:4000/api/user/admingroups`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      };

      const response = await axios.get(url, { headers });
      setGroups(response.data.groups || []);
    } catch (error) {
      console.log(error);
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
      <PageTitle page={"My Groups"} />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={30} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : groups.length > 0 ? (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
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

                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                      Members ({group.users?.length || 0})
                    </Typography>

                    <Paper elevation={0} sx={{ 
                      maxHeight: 150, 
                      overflow: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}>
                      <List dense>
                        {group.users?.map((user) => (
                          <ListItem key={user._id}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <Person />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={user.name}
                              secondary={user.email}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </CardContent>

                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Message />}
                      onClick={() => handleStartChat(group._id)}
                      disabled={group.chat !== "enabled"}
                    >
                      Start Chat Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center'
          }}>
            <Group sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Admin Groups Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You don't have any admin groups yet. Create one to get started!
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default SelfGroupList;
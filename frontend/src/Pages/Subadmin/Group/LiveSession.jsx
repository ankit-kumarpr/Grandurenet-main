import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Badge,
  Chip,
  Stack,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Send, 
  ArrowBack, 
  Person, 
  MoreVert, 
  EmojiEmotions, 
  AttachFile,
  Videocam,
  Mic
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const GradientAppBar = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
}));

const MessageBubble = styled(Box)(({ theme, own }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5, 2),
  borderRadius: own ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
  backgroundColor: own ? theme.palette.primary.main : theme.palette.grey[100],
  color: own ? theme.palette.common.white : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  wordBreak: 'break-word',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    [own ? 'right' : 'left']: -8,
    width: 0,
    height: 0,
    border: '8px solid transparent',
    borderTopColor: own ? theme.palette.primary.main : theme.palette.grey[100],
    borderRight: own ? 'none' : undefined,
    borderLeft: own ? undefined : 'none',
  }
}));

const LiveSession = () => {
  const { groupId } = useParams();
  const accessToken = sessionStorage.getItem('accessToken');
  const navigate = useNavigate();
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const messagesEndRef = useRef(null);
  
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.id;
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      auth: {
        token: accessToken
      }
    });
    
    setSocket(newSocket);

    const fetchInitialData = async () => {
      try {
        // Fetch group info
        const groupRes = await axios.get(`http://localhost:4000/api/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setGroupInfo(groupRes.data.group);

        // Fetch chat history
        const chatRes = await axios.get(`http://localhost:4000/api/user/chat-history/${groupId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (chatRes.data.success) {
          const formattedMessages = chatRes.data.messages.map(msg => ({
            ...msg,
            sender: {
              _id: msg.sender._id,
              name: msg.sender.name,
              email: msg.sender.email
            }
          }));
          setMessages(formattedMessages);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();

    newSocket.emit('joinSession', { 
      sessionId: groupId, 
      userId 
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email
        }
      }]);
    });

    newSocket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [groupId, userId, accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (socket) {
      socket.emit('sendMessage', {
        sessionId: groupId,
        userId,
        message: newMessage
      });
    }

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      p: 0,
      bgcolor: 'background.default'
    }}>
      <Paper elevation={3} sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <GradientAppBar sx={{ 
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ color: 'common.white' }}
            >
              <ArrowBack />
            </IconButton>
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main',
                width: 40,
                height: 40
              }}
            >
              {groupInfo?.groupname?.charAt(0) || 'G'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {groupInfo?.groupname || 'Group Chat'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {onlineUsers.length} online
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Chip 
              label={groupInfo?.grouptype === 'public' ? 'Public' : 'Private'} 
              size="small" 
              sx={{ 
                color: 'common.white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 'bold'
              }} 
            />
            <IconButton sx={{ color: 'common.white' }}>
              <MoreVert />
            </IconButton>
          </Stack>
        </GradientAppBar>

        {/* Messages area */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 2,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(https://www.transparenttextures.com/patterns/cubes.png)',
          backgroundAttachment: 'fixed'
        }}>
          {messages.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <img 
                src="https://cdn3.iconfinder.com/data/icons/chat-bot-emoji/512/Open_Book-512.png" 
                alt="No messages" 
                width="120"
                style={{ opacity: 0.5, marginBottom: 16 }}
              />
              <Typography variant="h6">No messages yet</Typography>
              <Typography variant="body2">Start the conversation with your group</Typography>
            </Box>
          ) : (
            <List sx={{ pb: 0 }}>
              {messages.map((msg, index) => (
                <React.Fragment key={msg._id || index}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      justifyContent: msg.sender._id === userId ? 'flex-end' : 'flex-start',
                      px: 1,
                      py: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender._id === userId ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'flex-end',
                      maxWidth: '80%',
                      flexDirection: msg.sender._id === userId ? 'row-reverse' : 'row'
                    }}>
                      {msg.sender._id !== userId && (
                        <Tooltip 
                          title={`${msg.sender.name} (${onlineUsers.includes(msg.sender._id) ? 'Online' : 'Offline'})`}
                          placement="left"
                        >
                          <Avatar 
                            alt={msg.sender.name} 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=random`}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                        </Tooltip>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender._id === userId ? 'flex-end' : 'flex-start'
                      }}>
                        {msg.sender._id !== userId && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'text.secondary',
                              mb: 0.5,
                              ml: 1
                            }}
                          >
                            {msg.sender.name}
                          </Typography>
                        )}
                        <MessageBubble own={msg.sender._id === userId}>
                          <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                            {msg.message}
                          </Typography>
                        </MessageBubble>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 0.5,
                            color: 'text.disabled',
                            alignSelf: msg.sender._id === userId ? 'flex-end' : 'flex-start'
                          }}
                        >
                          {formatTime(msg.sentAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Input area */}
        <Box sx={{ 
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <IconButton size="small">
              <AttachFile />
            </IconButton>
            <IconButton size="small">
              <EmojiEmotions />
            </IconButton>
            <IconButton size="small">
              <Videocam />
            </IconButton>
            <IconButton size="small">
              <Mic />
            </IconButton>
          </Stack>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              sx={{ 
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  backgroundColor: 'background.default'
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{ 
                minWidth: 48,
                height: 48,
                borderRadius: '50%',
                boxShadow: 2
              }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LiveSession;
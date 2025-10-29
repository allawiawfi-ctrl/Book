// pages/Messages/Messages.js - صفحة الرسائل
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import ConversationList from '../../components/ConversationList/ConversationList';
import MessageList from '../../components/MessageList/MessageList';
import MessageInput from '../../components/MessageInput/MessageInput';
import './Messages.css';

const Messages = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // محاكاة جلب المحادثات
    const loadConversations = async () => {
      setLoading(true);
      
      // بيانات محاكاة للمحادثات
      const mockConversations = [
        {
          id: 1,
          participant: {
            id: 2,
            name: 'محمد أحمد',
            avatar: '/images/avatar2.jpg',
            isOnline: true
          },
          lastMessage: {
            text: 'هل الكتاب لا يزال متاحاً؟',
            timestamp: '2023-10-20T14:30:00',
            isRead: true
          },
          unreadCount: 0,
          book: {
            id: 1,
            title: 'الأب الغني والأب الفقير',
            image: '/images/rich-dad-poor-dad.jpg',
            price: 25
          }
        },
        // يمكن إضافة المزيد من المحادثات
      ];
      
      setConversations(mockConversations);
      
      // إذا كانت هناك محادثات، حدد الأولى كنشطة
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
        
        // جلب الرسائل للمحادثة النشطة
        loadMessages(mockConversations[0].id);
      }
      
      setLoading(false);
    };
    
    loadConversations();
  }, [user, navigate]);

  const loadMessages = async (conversationId) => {
    // محاكاة جلب الرسائل
    const mockMessages = [
      {
        id: 1,
        senderId: 2,
        text: 'مرحباً، رأيت كتابك "الأب الغني والأب الفقير"',
        timestamp: '2023-10-20T14:25:00',
        isRead: true
      },
      {
        id: 2,
        senderId: 2,
        text: 'هل الكتاب لا يزال متاحاً؟',
        timestamp: '2023-10-20T14:30:00',
        isRead: true
      },
      {
        id: 3,
        senderId: user.id,
        text: 'نعم، الكتاب لا يزال متاحاً',
        timestamp: '2023-10-20T14:35:00',
        isRead: true
      },
      {
        id: 4,
        senderId: user.id,
        text: 'هل ترغب في الشراء أم التبادل؟',
        timestamp: '2023-10-20T14:36:00',
        isRead: true
      }
    ];
    
    setMessages(mockMessages);
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
    
    // وضع علامة كمقروء
    markAsRead(conversation.id);
  };

  const markAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    
    setConversations(updatedConversations);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim() || !activeConversation) return;
    
    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // تحديث المحادثة الأخيرة
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id 
        ? { 
            ...conv, 
            lastMessage: {
              text: messageText,
              timestamp: new Date().toISOString(),
              isRead: false
            }
          } 
        : conv
    );
    
    setConversations(updatedConversations);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل الرسائل...</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>الرسائل</h1>
        <p>تواصل مع البائعين والمشترين بخصوص الكتب</p>
      </div>

      <div className="messages-content">
        {conversations.length > 0 ? (
          <div className="messages-layout">
            {/* قائمة المحادثات */}
            <div className="conversations-sidebar">
              <ConversationList 
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* منطقة المحادثة */}
            <div className="conversation-area">
              {activeConversation ? (
                <>
                  <div className="conversation-header">
                    <div className="participant-info">
                      <img 
                        src={activeConversation.participant.avatar} 
                        alt={activeConversation.participant.name}
                        className="participant-avatar"
                      />
                      <div className="participant-details">
                        <h3>{activeConversation.participant.name}</h3>
                        <span className={`status ${activeConversation.participant.isOnline ? 'online' : 'offline'}`}>
                          {activeConversation.participant.isOnline ? 'متصل الآن' : 'غير متصل'}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/books/${activeConversation.book.id}`}
                      className="book-link"
                    >
                      <img 
                        src={activeConversation.book.image} 
                        alt={activeConversation.book.title}
                        className="book-thumbnail"
                      />
                      <div className="book-info">
                        <span className="book-title">{activeConversation.book.title}</span>
                        <span className="book-price">{activeConversation.book.price} ر.س</span>
                      </div>
                    </Link>
                  </div>

                  <div className="messages-container">
                    <MessageList 
                      messages={messages}
                      currentUserId={user.id}
                    />
                  </div>

                  <div className="message-input-container">
                    <MessageInput onSendMessage={handleSendMessage} />
                  </div>
                </>
              ) : (
                <div className="no-conversation-selected">
                  <img src="/images/select-conversation.svg" alt="اختر محادثة" />
                  <h3>اختر محادثة لبدء المحادثة</h3>
                  <p>اختر من قائمة المحادثات على اليسار لعرض الرسائل</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-conversations">
            <img src="/images/no-messages.svg" alt="لا توجد رسائل" />
            <h3>لا توجد رسائل بعد</h3>
            <p>ابدأ محادثة جديدة مع البائعين أو المشترين</p>
            <Link to="/books" className="browse-books-btn">
              تصفح الكتب المتاحة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

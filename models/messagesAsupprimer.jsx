import React, { useEffect, useState } from 'react'; 
import {  
  fetchMessages,  
  replyToMessage,  
  deleteMessage,  
  markMessageAsRead,  
  markAsReplied  
} from '../../services/api'; 
import { BsTrash3 } from "react-icons/bs"; 
import './messages.scss'; 
const Messages = () => { 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedMessage, setSelectedMessage] = useState(null); 
  const [replyContent, setReplyContent] = useState(''); 
  const [showReplyForm, setShowReplyForm] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); 
  const getMessages = async () => { 
    setLoading(true); 
    try { 
      const data = await fetchMessages(); 
      console.log('Données chargées dans le composant :', data); 
      setMessages(data); 
    } catch (err) { 
      console.error('Erreur dans le composant Messages:', err); 
      setError('Erreur lors de la récupération des messages'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  useEffect(() => { 
    const getMessages = async () => { 
      setLoading(true); 
      try { 
        const data = await fetchMessages(); 
        console.log('Données chargées dans le composant :', data); 
        setMessages(data.map(msg => ({ 
          ...msg, 
          isReplied: msg.replied, // Assurez-vous que isReplied est correctement défini 
        }))); 
      } catch (err) { 
        console.error('Erreur dans le composant Messages:', err); 
        setError('Erreur lors de la récupération des messages'); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    getMessages(); 
  }, []); 
  const sortMessages = (key) => { 
    let direction = 'asc'; 
    if (sortConfig.key === key && sortConfig.direction === 'asc') { 
      direction = 'desc'; 
    } 
    setSortConfig({ key, direction }); 
    const sortedMessages = [...messages].sort((a, b) => { 
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; 
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1; 
      return 0; 
    }); 
    setMessages(sortedMessages); 
  }; 
  const getSortIcon = (key) => { 
    if (sortConfig.key === key) { 
      return sortConfig.direction === 'asc' ? '▲' : '▼'; 
    } 
    return '⇅'; 
  }; 
  const handleDeleteMessage = async (id) => { 
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return; 
    try { 
      await deleteMessage(id); 
      setMessages(messages.filter((msg) => msg._id !== id)); 
    } catch { 
      alert('Erreur lors de la suppression du message'); 
    } 
  }; 
  const markAsRead = async (id) => { 
    try { 
      await markMessageAsRead(id); 
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg._id === id ? { ...msg, read: true } : msg 
        ) 
      ); 
    } catch (error) { 
      console.error('Erreur lors du marquage comme lu', error); 
    } 
  }; 
  const handleMarkAsReplied = async (id) => { 
    try { 
      await markAsReplied(id); 
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg._id === id ? { ...msg, isReplied: true } : msg 
        ) 
      ); 
    } catch (error) { 
      console.error('Erreur lors du marquage comme répondu', error); 
    } 
  }; 
  const handleReply = async (id) => { 
    if (!replyContent.trim()) { 
      alert('Veuillez écrire une réponse.'); 
      return; 
    } 
    try { 
      await replyToMessage(id, replyContent); // Assurez-vous d'envoyer replyContent directement 
      alert('Réponse envoyée avec succès'); 
      setReplyContent(''); 
      setShowReplyForm(false); 
      // Mettez à jour l'état après la réponse 
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg._id === id ? { ...msg, isReplied: true } : msg // Met à jour isReplied 
        ) 
      ); 
    } catch { 
      alert('Erreur lors de l\'envoi de la réponse'); 
    } 
  }; 
  const handleUpdateMessage = (id) => { 
    setMessages((prevMessages) => 
      prevMessages.map((message) => 
        message.id === id ? { ...message, replied: !message.replied } : message 
      ) 
    ); 
  }; 
  const toggleReplied = (id) => { 
    setMessages((prevMessages) => 
      prevMessages.map((msg) => 
        msg.id === id ? { ...msg, replied: !msg.replied } : msg 
      ) 
    ); 
  }; 
  useEffect(() => { 
    getMessages(); 
  }, []); 
  if (loading) return <p>Chargement...</p> 
  if (error) return <p>{error}</p> 
  return ( 
    <div className='messages content'> 
      <h2>Messages reçus</h2> 
      <button onClick={getMessages} style={{ marginBottom: '20px' }} disabled={loading}> 
        {loading ? 'Actualisation...' : 'Actualiser les messages'} 
      </button> 
      <table> 
        <thead> 
          <tr> 
            <th onClick={() => sortMessages('receivedAt')}> 
              Reçu le {getSortIcon('receivedAt')} 
            </th> 
            <th onClick={() => sortMessages('name')}> 
              Nom {getSortIcon('name')} 
            </th> 
            <th onClick={() => sortMessages('email')}> 
              Email {getSortIcon('email')} 
            </th> 
            <th onClick={() => sortMessages('subject')}> 
              Sujet {getSortIcon('subject')} 
            </th> 
            <th onClick={() => sortMessages('read')}> 
              Lu {getSortIcon('read')} 
            </th> 
            <th onClick={() => sortMessages('isReplied')}> 
              Répondu {getSortIcon('isReplied')} 
            </th> 
            <th></th> 
          </tr> 
        </thead> 
        <tbody> 
          {messages.map((msg) => ( 
            <tr 
              key={msg._id} 
              className={`message-row ${msg.read ? 'read' : 'unread'} ${ 
                selectedMessage && selectedMessage._id === msg._id ? 'msg-active' : '' 
              }`} 
              onClick={() => { 
                setSelectedMessage(msg); 
                markAsRead(msg._id); 
              }} 
            > 
              <td>{new Date(msg.receivedAt).toLocaleDateString()}</td> 
              <td>{msg.name}</td> 
              <td>{msg.email}</td> 
              <td>{msg.subject}</td> 
              <td>{msg.read ? '✅' : '❌'}</td> 
              <td style={{ color: msg.isReplied ? 'green' : 'red' }}> 
                 {msg.isReplied ? '🟢' : '🔴'} 
              </td> 
              <td> 
                <div className="buttons-actions"> 
                  {!msg.read && ( 
                    <button onClick={() => markAsRead(msg._id)}>Marquer comme lu</button> 
                  )} 
                  {!msg.isReplied && ( 
                    <button onClick={() => handleMarkAsReplied(msg._id)}>Marquer comme répondu</button> 
                  )} 
                  <button onClick={() => handleDeleteMessage(msg._id)}> 
                    <BsTrash3 /> 
                  </button> 
                </div> 
              </td> 
            </tr> 
          ))} 
        </tbody> 
      </table> 
      {selectedMessage && ( 
        <div className="message-details"> 
            <button onClick={() => setShowReplyForm(true)}>Répondre</button> 
          <button onClick={() => handleDeleteMessage(selectedMessage._id)}>Supprimer</button> 
          <button onClick={() => setSelectedMessage(null)}>Fermer</button> 
          <h3>Détails du Message</h3> 
          <p><strong>Nom :</strong> {selectedMessage.name}</p> 
          <p><strong>Email :</strong> {selectedMessage.email}</p> 
          <p><strong>Sujet :</strong> {selectedMessage.subject}</p> 
          <p><strong>Message :</strong> {selectedMessage.content}</p> 
        </div> 
      )} 
      {showReplyForm && selectedMessage && ( 
        <div className="reply-form"> 
          <h3>Répondre à {selectedMessage.name}</h3> 
          <textarea 
            rows="4" 
            placeholder="Votre réponse..." 
            value={replyContent} 
            onChange={(e) => setReplyContent(e.target.value)} 
          /> 
          <button onClick={() => handleReply(selectedMessage._id)}>Envoyer</button> 
          <button onClick={() => setShowReplyForm(false)}>Annuler</button> 
        </div> 
      )} 
    </div> 
  ); 
}; 
export default Messages; 
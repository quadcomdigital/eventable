import React, { useState, useRef, useEffect } from 'react';
import type { ChatConversation, Message } from '../types';
import { PaperAirplaneIcon, MagnifyingGlassIcon, CheckIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowLeftIcon } from './Icons';

interface ChatPageProps {
    conversations: ChatConversation[];
    setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversations, setConversations }) => {
    const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
    const [newMessage, setNewMessage] = useState('');
    const [isChatVisibleMobile, setIsChatVisibleMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsChatVisibleMobile(true); // On desktop, chat is always visible
                if (!activeConversationId && conversations.length > 0) {
                    setActiveConversationId(conversations[0].id); // Default to first chat on desktop
                }
            } else {
                setIsChatVisibleMobile(activeConversationId !== null);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, [activeConversationId, conversations]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isChatVisibleMobile) {
            scrollToBottom();
        }
    }, [activeConversation, isChatVisibleMobile]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const message: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            read: true,
        };

        const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversationId) {
                return { ...conv, messages: [...conv.messages, message] };
            }
            return conv;
        });

        setConversations(updatedConversations);
        setNewMessage('');
    };

    const handleSelectConversation = (id: number) => {
        setActiveConversationId(id);
        if (window.innerWidth < 768) {
            setIsChatVisibleMobile(true);
        }
    };
    
    const handleBackToList = () => {
        setIsChatVisibleMobile(false);
        // Optional: clear active conversation on mobile when going back
        // setActiveConversationId(null); 
    };

    const getLastMessage = (conv: ChatConversation) => {
        return conv.messages[conv.messages.length - 1];
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
            {/* Sidebar con lista chat */}
            <div className={`w-full md:w-1/3 border-r border-stone-200/80 flex-col ${isChatVisibleMobile && 'hidden'} md:flex`}>
                <div className="p-4 border-b border-stone-200/80">
                    <h2 className="text-xl font-semibold text-stone-800">Chat</h2>
                     <div className="relative mt-2">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input 
                            type="text" 
                            placeholder="Cerca o inizia una nuova chat"
                            className="w-full bg-stone-100 border border-stone-200/80 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => {
                        const lastMessage = getLastMessage(conv);
                        return (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv.id)}
                                className={`flex items-center p-3 cursor-pointer transition-colors ${activeConversationId === conv.id ? 'bg-amber-50' : 'hover:bg-stone-50'}`}
                            >
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-600 mr-3 flex-shrink-0">
                                    {conv.clientName.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-stone-800 truncate">{conv.clientName}</p>
                                        <p className="text-xs text-stone-400 flex-shrink-0">{lastMessage.timestamp}</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-stone-500 truncate">{lastMessage.text}</p>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-amber-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Finestra della chat attiva */}
            <div className={`w-full md:w-2/3 flex-col ${!isChatVisibleMobile && 'hidden'} md:flex`}>
                {activeConversation ? (
                    <>
                        <div className="p-3 border-b border-stone-200/80 flex items-center flex-shrink-0">
                             <button onClick={handleBackToList} className="md:hidden p-2 mr-2 text-stone-500 hover:bg-stone-100 rounded-full">
                               <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-600 mr-3">
                                {activeConversation.clientName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-stone-800">{activeConversation.clientName}</h3>
                                <p className="text-xs text-green-600">Online</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-stone-50/50 space-y-4">
                            {activeConversation.messages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-amber-400 text-white rounded-br-none' : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    {msg.sender === 'user' && (
                                        <CheckIcon className="w-4 h-4 text-blue-500 mb-1" />
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200/80 bg-white flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Scrivi un messaggio..."
                                    className="flex-1 px-4 py-2 bg-stone-100 border border-stone-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-amber-400 text-white font-semibold p-2.5 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 hidden md:flex items-center justify-center text-center text-stone-500">
                        <div>
                            <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 mx-auto text-stone-300"/>
                            <h2 className="mt-2 text-xl font-semibold">Benvenuto nella tua casella di posta</h2>
                            <p>Seleziona una conversazione per iniziare a chattare.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const VideoCall = ({ isOpen, onClose, roomId, currentUser, socket, incomingCall, caller }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      startVideoCall();
    }
  }, [isOpen]);

  const startVideoCall = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'turn:YOUR_TURN_SERVER', username: 'USERNAME', credential: 'CREDENTIAL' }
        ]
      });

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = event => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('candidate', { roomId, candidate: event.candidate });
        }
      };

      setPeerConnection(pc);

      if (incomingCall) {
        socket.on('offer', async (data) => {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { roomId, answer });
        });

        socket.on('candidate', async (data) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        });
      } else {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { roomId, offer });
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const handleCallAcceptance = () => {
    setIsCallAccepted(true);
    socket.emit('acceptCall', { roomId });
  };

  const handleCallRejection = () => {
    socket.emit('rejectCall', { roomId });
    onClose();
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    onClose();
    navigate('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Video Call Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="video-call">
        {incomingCall && !isCallAccepted ? (
          <div className="incoming-call">
            <h2>Incoming call from {caller.firstname}</h2>
            <button onClick={handleCallAcceptance} className="bg-green-500 text-white p-2 rounded-lg mt-4">Accept Call</button>
            <button onClick={handleCallRejection} className="bg-red-500 text-white p-2 rounded-lg mt-4">Reject Call</button>
          </div>
        ) : (
          <>
            <video ref={localVideoRef} autoPlay muted className="local-video" />
            <video ref={remoteVideoRef} autoPlay className="remote-video" />
            <button onClick={handleEndCall} className="bg-red-500 text-white p-2 rounded-lg mt-4">End Call</button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VideoCall;

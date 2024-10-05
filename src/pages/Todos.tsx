import React, { useState } from "react";
import { TrashIcon, PlusIcon, XIcon } from "@heroicons/react/solid"; // Import the XIcon from heroicons
import Layout from "./Layout"; // Adjust the path to your Layout component
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Todos = () => {
  const { user } = useAuth0();
  const [userId, setUserId] = useState(null);

  const getUserByUsername = async () => {
    try {
      const response = await axios.post(`http://192.168.1.204:5001/users/name`, { name: user.name });
      if (response.data && response.data.length > 0) {
        const fetchedUserId = response.data[0]._id;
        setUserId(fetchedUserId);
        console.log("User ID:", fetchedUserId);
        return fetchedUserId;
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return null;
    }
  };
  
  // Initial state for the draggable cards
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Daily To dos",
      tasks: ["Do Leetcode", "Cook", "Eat Food"],
      position: { x: 100, y: 100 },
      defaultPosition: { x: 100, y: 100 },
    },
    {
      id: 2,
      title: "Weekly Goals",
      tasks: ["Do Leetcode", "Cook", "Eat Food"],
      position: { x: 350, y: 100 },
      defaultPosition: { x: 350, y: 100 },
    },
    {
      id: 3,
      title: "Long Term Goals",
      tasks: ["Get a house"],
      position: { x: 600, y: 100 },
      defaultPosition: { x: 600, y: 100 },
    },
  ]);

  const [activeTab, setActiveTab] = useState("todos"); // Track the active tab
  const [draggingCard, setDraggingCard] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Additional state for handling card removal confirmation
  const [cardToRemove, setCardToRemove] = useState(null); // Track the card to remove
  const [showConfirmation, setShowConfirmation] = useState(false); // Show or hide the confirmation popup
  const [editingCardId, setEditingCardId] = useState(null); // Track which card is being edited
  const [editingTitle, setEditingTitle] = useState(""); // Track the title being edited

  // Function to show the confirmation popup
  const confirmRemoveCard = (cardId) => {
    setCardToRemove(cardId);
    setShowConfirmation(true);
  };

  // Function to actually remove the card after confirmation
  const handleRemoveCard = () => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardToRemove));
    setShowConfirmation(false);
    setCardToRemove(null);
  };

  // Function to cancel the removal
  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setCardToRemove(null);
  };

  // Function to handle adding a new card
  const addCard = async () => {
    getUserByUsername();
    const title = prompt("Enter a title for the new card:");
    if (title) {
      console.log("Starting API call to add a new card...");
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://192.168.1.204:5001/notes/' + userId + '/create',
        data: {
          title,
          description: '',
          tasks: [],
          userId: userId
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        }
      };

      try {
        const response = await axios.request(config);
        console.log("POST response:", response.data);
        const newCard = {
          id: response.data.newNote._id,
          title: response.data.newNote.title,
          tasks: [],
          userId: userId,
          position: { x: 100 + cards.length * 150, y: 100 },
          defaultPosition: { x: 100 + cards.length * 150, y: 100 },
        };
        setCards([...cards, newCard]);
      } catch (error) {
        console.error('Error adding card:', error);
      }
    }
  };

  // Function to handle adding a task
  const addTask = (cardId) => {
    const newTask = prompt("Enter a new task:");
    if (newTask) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, tasks: [...card.tasks, newTask] }
            : card
        )
      );
    }
  };

  // Function to handle removing a task
  const removeTask = (cardId, taskIndex) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.filter((_, index) => index !== taskIndex),
            }
          : card
      )
    );
  };

  // Function to handle the drag start
  const handleDragStart = (event, card) => {
    setDraggingCard(card.id);
    setOffset({
      x: event.clientX - card.position.x,
      y: event.clientY - card.position.y,
    });
  };

  // Function to handle dragging movement
  const handleDrag = (event) => {
    if (draggingCard !== null) {
      const updatedCards = cards.map((card) => {
        if (card.id === draggingCard) {
          return {
            ...card,
            position: {
              x: event.clientX - offset.x,
              y: event.clientY - offset.y,
            },
          };
        }
        return card;
      });
      setCards(updatedCards);
    }
  };

  // Function to handle drag end and check boundaries
  const handleDragEnd = () => {
    if (draggingCard !== null) {
      const card = cards.find((card) => card.id === draggingCard);

      // Calculate the actual card width and height based on the content
      const cardWidth = 200; // Set the exact width of your card
      const cardHeight = 80 + card.tasks.length * 24; // Adjust height based on the tasks

      // Get the viewport dimensions
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const footerHeight = 64; // Assuming footer height is 64px, adjust this value accordingly

      // Check if the card is out of bounds including footer
      const outOfBoundsLeft = card.position.x < 0;
      const outOfBoundsRight = card.position.x + cardWidth > containerWidth;
      const outOfBoundsTop = card.position.y < 0;
      const outOfBoundsBottom = card.position.y + cardHeight > containerHeight - footerHeight;

      const isOutOfBounds =
        outOfBoundsLeft || outOfBoundsRight || outOfBoundsTop || outOfBoundsBottom;

      // If out of bounds, reset to default position
      if (isOutOfBounds) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === draggingCard ? { ...c, position: c.defaultPosition } : c
          )
        );
      }

      // Stop dragging
      setDraggingCard(null);
    }
  };

  // Function to enable title editing
  const enableEditTitle = (cardId, title) => {
    setEditingCardId(cardId);
    setEditingTitle(title);
  };

  // Function to handle title change
  const handleTitleChange = (e) => {
    setEditingTitle(e.target.value);
  };

  // Function to save the edited title
  const saveTitle = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, title: editingTitle } : card
      )
    );
    setEditingCardId(null);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div
        className="relative w-full h-full"
        style={{ width: "100%", height: "calc(100vh - 64px)", overflow: "hidden" }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="card bg-gray-200 text-black p-4 rounded-lg shadow-lg absolute cursor-pointer"
            style={{
              top: card.position.y,
              left: card.position.x,
              width: "200px",
              zIndex: draggingCard === card.id ? 1000 : 1,
            }}
            onMouseDown={(event) => handleDragStart(event, card)}
          >
            {/* Card Title Editing */}
            <div className="flex justify-between items-center mb-2">
              {editingCardId === card.id ? (
                <input
                  value={editingTitle}
                  onChange={handleTitleChange}
                  onBlur={() => saveTitle(card.id)}
                  autoFocus
                  className="border p-1 rounded w-full"
                />
              ) : (
                <h3
                  className="text-lg font-bold text-center flex-1 cursor-pointer"
                  onClick={() => enableEditTitle(card.id, card.title)}
                >
                  {card.title}
                </h3>
              )}
              <XIcon
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => confirmRemoveCard(card.id)}
              />
            </div>
            <div className="tasks-list">
              {card.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-1"
                >
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{task}</span>
                  </label>
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => removeTask(card.id, index)}
                  />
                </div>
              ))}
            </div>
            <div
              className="flex justify-center mt-3 cursor-pointer text-center"
              onClick={() => addTask(card.id)}
            >
              <PlusIcon className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        ))}

        {/* Add New Card Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={addCard}
            className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Confirmation Popup */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg mb-4">Are you sure you want to remove this note?</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRemoveCard}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Todos;

import React, { useContext, useEffect, useState } from "react";
import { TrashIcon, PlusIcon, XIcon, MenuAlt2Icon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Layout from "./Layout";
import { UserContext } from "../App";
import axios from "axios";

const Todos = () => {
  
  const { userId } = useContext(UserContext);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch the current user's data when the component mounts
    const fetchNoteData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notes/user/${userId}`); // Replace with your actual API endpoint
        // //console.log("Notes data:", response.data);
        const todos = response.data.notes.map((note, index) => ({
          noteId: note._id,
          id: index + 1, // Assigning a unique ID based on the index
          title: note.title,
          tasks: note.tasks.map(task => ({
              text: task.task, // Mapping task text
              checked: task.completed, // Mapping completed status
              id: task._id,
              subtasks: task.subTasks // Mapping subtasks (if any)
          })),
          position: { 
            x: 100 + (index % 3) * 250, // Calculate x based on column (0, 1, 2)
            y: 100 + Math.floor(index / 3) * 150 // Calculate y based on row
        }, 
        defaultPosition: { 
            x: 100 + (index % 3) * 250, 
            y: 100 + Math.floor(index / 3) * 150 
        } 
      }));
      // //console.log("Todos:", todos);
      setCards(todos);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchNoteData();
  }, [cards, userId]);


  
  const [activeTab, setActiveTab] = useState("todos");
  const [draggingCard, setDraggingCard] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggingTask, setDraggingTask] = useState(null); // Track the task being dragged
  const [draggingType, setDraggingType] = useState(null); // Track whether card or task is being dragged
  const [cardToRemove, setCardToRemove] = useState(null);
  const [taskToRemove, setTaskToRemove] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationTask, setShowConfirmationTask] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [openSublistIndex, setOpenSublistIndex] = useState({});

  const handleCardDragStart = (event, card) => {
    if (draggingType === "task") return; // Don't drag the card when dragging a task
    setDraggingType("card"); // Set type to card dragging
    setDraggingCard(card.id);
    setOffset({
      x: event.clientX - card.position.x,
      y: event.clientY - card.position.y,
    });
  };

  const handleCardDrag = (event) => {
    if (draggingCard !== null && draggingType === "card") {
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

  const handleCardDragEnd = () => {
    if (draggingCard !== null && draggingType === "card") {
      const card = cards.find((card) => card.id === draggingCard);

      const cardWidth = 200;
      const cardHeight = 80 + card.tasks.length * 24;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const footerHeight = 64;

      const outOfBoundsLeft = card.position.x < 0;
      const outOfBoundsRight = card.position.x + cardWidth > containerWidth;
      const outOfBoundsTop = card.position.y < 0;
      const outOfBoundsBottom =
        card.position.y + cardHeight > containerHeight - footerHeight;

      const isOutOfBounds =
        outOfBoundsLeft || outOfBoundsRight || outOfBoundsTop || outOfBoundsBottom;

      if (isOutOfBounds) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === draggingCard ? { ...c, position: c.defaultPosition } : c
          )
        );
      }

      setDraggingCard(null);
      setDraggingType(null); // Reset dragging type
    }
  };

  const handleTitleChange = (e) => {
    setEditingTitle(e.target.value);
  };

  const saveTitle = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, title: editingTitle } : card
      )
    );
    setEditingCardId(null);
  };

  const enableEditTitle = (cardId, title) => {
    setEditingCardId(cardId);
    setEditingTitle(title);
  };

  const confirmRemoveCard = (cardId) => {
    setCardToRemove(cardId);
    setShowConfirmation(true);
  };
  const confirmRemoveTask = (taskId) => {
    // //console.log("Task ID:", taskId);
    setTaskToRemove(taskId);
    setShowConfirmationTask(true);
  };

    // Remove the card with the specified ID
    const handleRemoveCard = async () => {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/notes/${cardToRemove}`); // Replace with your actual API endpoint
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardToRemove));
        setShowConfirmation(false);
        setCardToRemove(null);
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setCardToRemove(null);
  };
  const handleCancelRemoveTask = () => {
    setShowConfirmationTask(false);
    setTaskToRemove(null);
  };

  const addCard = async () => {
    const title = prompt("Enter a title for the new card:");
    if (title) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notes/${userId}/create`, { title: title }); // Replace with your actual API endpoint
        const newCard = {
          id: response.data.id,
          title,
          tasks: [],
          position: { x: 100 + cards.length * 150, y: 100 },
          defaultPosition: { x: 100 + cards.length * 150, y: 100 },
        };
        setCards([...cards, newCard]);
      } catch (error) {
        console.error("Error adding new card:", error);
      }
    }
  };

  // const removeTask = (cardId, taskIndex) => {
  //   await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${cardToRemove}`); // Replace with your actual API endpoint
  //   setCards((prevCards) =>
  //     prevCards.map((card) =>
  //       card.id === cardId
  //         ? { ...card, tasks: card.tasks.filter((_, index) => index !== taskIndex) }
  //         : card
  //     )
  //   );
  // };
  const handleRemoveTask = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskToRemove}`); // Replace with your actual API endpoint
      // setCards((prevCards) => prevCards.filter((card) => card.tasks._id !== taskToRemove));
      setShowConfirmationTask(false);
      setTaskToRemove(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTask = async (cardId) => {
    const newTask = prompt("Enter a new task:");
    if (newTask) {
      try {
        // //console.log("Adding new task:", newTask, cardId);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/create`, {
          noteId: cardId,
          task: newTask,
        });
        // //console.log("New task response:", response.data);
        const newTaskId = response.data.newTask._id;
        // //console.log("Cards:", response.data.newTask._id);
        const updatedCards = cards.map((card) =>
          card.id === cardId
            ? { ...card, tasks: [...card.tasks, { text: newTask, checked: false, id: newTaskId, subtasks: null }] }
            : card
        );
        setCards(updatedCards);
        // //console.log("Updated cards:", updatedCards);
      } catch (error) {
        console.error("Error adding new task:", error);
      }
    }
  };
  // Generate subtasks (for now static, but will be dynamic from backend in the future)

  const generateSubtasks = async (cardId, taskIndex, taskId) => {

    //console.log("Card ID:", cardId, "Task Index:", taskIndex, "Task ID:", taskId);
    const card = cards.find((card) => card.noteId === cardId);
    const task = card.tasks.find((task) => task.id === taskId);
    //console.log("Task:", task);
    if (task.subtasks && task.subtasks.length > 0) {
      // If subtasks already exist, do not generate new ones
      alert("Subtasks already exist for this task. Delete the existing task and recreate it.");
      return;
    }
    try {
      // Simulate an API call to fetch new subtasks
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/generate-subtasks/`, {taskId: taskId}); // Replace with your actual API endpoint
      const newSubtasks = response.data.subTasks; // Assuming the response contains an array of subtasks
      //console.log("Response:", response.data);
      //console.log("New Subtasks:", newSubtasks);
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === cardId) {
            const updatedTasks = [...card.tasks];
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              subtasks: newSubtasks, // Set the fetched subtasks
            };

            // Set the sublist to open immediately after generating subtasks
            setOpenSublistIndex((prevState) => ({
              ...prevState,
              [`${cardId}-${taskIndex}`]: true, // Open the subtasks (show the up arrow)
            }));

            return { ...card, tasks: updatedTasks };
          }
          return card;
        })
      );
    } catch (error) {
      console.error("Error generating subtasks:", error);
    }
  };

  const handleCheckboxChange = (cardId, taskIndex) => {
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === cardId) {
          const updatedTasks = [...card.tasks];
          const updatedTask = {
            ...updatedTasks[taskIndex],
            checked: !updatedTasks[taskIndex].checked,
          };

          updatedTasks.splice(taskIndex, 1);

          if (updatedTask.checked) {
            updatedTasks.push(updatedTask);
            setOpenSublistIndex((prevState) => {
              const newState = { ...prevState };
              delete newState[`${cardId}-${taskIndex}`];
              return newState;
            });
          } else {
            updatedTasks.unshift(updatedTask);
          }

          return { ...card, tasks: updatedTasks };
        }
        return card;
      })
    );
  };

  const handleTaskDragStart = (e, cardId, taskIndex) => {
    e.stopPropagation();
    setDraggingType("task");
    setDraggingTask({ cardId, taskIndex });
  };

  const handleTaskDrop = (cardId, taskIndex) => {
    if (draggingTask.cardId === cardId && draggingTask.taskIndex !== taskIndex) {
      const card = cards.find((card) => card.id === cardId);

      const newTaskList = [...card.tasks];
      const [movedTask] = newTaskList.splice(draggingTask.taskIndex, 1);
      newTaskList.splice(taskIndex, 0, movedTask);

      const newOpenSublistIndex = { ...openSublistIndex };
      const draggedKey = `${cardId}-${draggingTask.taskIndex}`;
      const targetKey = `${cardId}-${taskIndex}`;

      const draggedSublistOpen = newOpenSublistIndex[draggedKey];
      const targetSublistOpen = newOpenSublistIndex[targetKey];

      newOpenSublistIndex[draggedKey] = targetSublistOpen;
      newOpenSublistIndex[targetKey] = draggedSublistOpen;

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, tasks: newTaskList } : card
        )
      );
      setOpenSublistIndex(newOpenSublistIndex);
      setDraggingTask(null);
      setDraggingType(null);
    }
  };

  const toggleSublist = (cardId, index) => {
    const uniqueKey = `${cardId}-${index}`;
    setOpenSublistIndex((prevState) => ({
      ...prevState,
      [uniqueKey]: !prevState[uniqueKey],
    }));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div
        className="relative w-full h-full"
        style={{ width: "100%", height: "calc(100vh - 64px)", overflow: "hidden" }}
        onMouseMove={handleCardDrag}
        onMouseUp={handleCardDragEnd}
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
            onMouseDown={(event) => handleCardDragStart(event, card)}
          >
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
                onClick={() => confirmRemoveCard(card.noteId)}
              />
            </div>
            <div className="tasks-list">
              {card.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex flex-col mb-1"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleTaskDrop(card.id, index)}
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="cursor-move mr-2"
                      draggable
                      onDragStart={(e) => handleTaskDragStart(e, card.id, index)}
                    >
                      <MenuAlt2Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <label className="flex items-center justify-start w-full">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={task.checked}
                        onChange={() => handleCheckboxChange(card.id, index)}
                      />
                      <span className={`text-left ${task.checked ? "line-through" : ""}`}>
                        {task.text} 
                      </span>
                    </label>

                    {task.subtasks && task.subtasks.length > 0 ? (
                      openSublistIndex[`${card.id}-${index}`] ? (
                        <ChevronUpIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() => toggleSublist(card.id, index)}
                        />
                      ) : (
                        <ChevronDownIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() => toggleSublist(card.id, index)}
                        />
                      )
                    ) : (
                      <button
                        className="text-xs text-gray-500"
                        onClick={() => generateSubtasks(card.noteId, index, task.id)}
                      >
                        📋
                      </button>
                      
                    )}

                    <TrashIcon
                      className="h-5 w-5 text-red-500 cursor-pointer"
                      onClick={() => confirmRemoveTask(task.id)}
                    />
                  </div>

                  {openSublistIndex[`${card.id}-${index}`] && task.subtasks && (
                    <div className="ml-8 mt-2">
                      <ul className="list-decimal text-sm">
                        {task.subtasks.map((subtask, subIndex) => (
                          <li key={subIndex}>{subtask.subTask}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className="flex justify-center mt-3 cursor-pointer text-center"
              onClick={() => addTask(card.noteId)}
            >
              <PlusIcon className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={addCard}
            className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg mb-4">Are you sure you want to remove this card?</h3>
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

{showConfirmationTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg mb-4">Are you sure you want to remove this task?</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRemoveTask}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemoveTask}
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

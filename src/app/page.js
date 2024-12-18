'use client'

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import CreateProject from "@/components/createProject";

export default function Home() {
  const [UserID, setUserID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [update, setUpdate] = useState(false);
  const [role, setRole] = useState("employee");

  function parseCookies() {
    return document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
  }


  useEffect(() => {
    const cookies = parseCookies();

    try {
      // Extract employeeId and role from cookies
      const cookies = JSON.parse(parseCookies()["UserDetails"]);
      console.log("cookies", cookies)
      const employeeId = cookies["UserID"];
      setUserID(employeeId)
      const userRole = cookies["UserRole"];

      setRole(userRole);
      console.log(role, UserID)
      if (employeeId) {
        console.log("Employee ID:", employeeId); // You can use this wherever needed
      } else {
        console.error("Employee ID not found in cookies.");
      }
    } catch (err) {
      setError("Error verifying token.");
    }
  }, []);


  // Function to fetch tasks if the user is a manager

  useEffect(() => {
    try {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProjects(data.projects))
        .catch((err) => console.error(err));
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }, [setUpdate, update]);

  useEffect(() => {
    try {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProjects(data.projects))
        .catch((err) => console.error(err));
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }, []);

  async function handleAccept(id) {
    const cookies = JSON.parse(parseCookies()["UserDetails"]);
    console.log("cookies", cookies)
    const employeeId = cookies["UserID"];

    if (!employeeId) {
      console.error("Employee ID not found in cookies.");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "In Progress", assignedTo: employeeId }),
      });
      const data = await response.json();
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, status: "In Progress", assignedTo: employeeId } : project
        )
      );
    } catch (error) {
      console.error("Error accepting project:", error);
    }
  }

  async function handleComplete(id) {
    try {
      const response = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Completed" }),
      });
      const data = await response.json();
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, status: "Completed" } : project
        )
      );
    } catch (error) {
      console.error("Error completing project:", error);
    }
  }

  async function handleScore(id, score) {
    try {
      const response = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, score }),
      });
      const data = await response.json();
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, score } : project
        )
      );
    } catch (error) {
      console.error("Error scoring project:", error);
    }
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="flex">
        {
          role === "manager" ?
            <div>
              <CreateProject setUpdate={setUpdate} />
            </div> : null
        }
        {
          loading ? <p>Loading</p> :
            <div className="container">
              <h1 className="text-2xl font-bold">Project Assignments</h1>
              <div className="grid gap-4 mt-4">
                {projects?.map((project) => (
                  <div key={project._id} className="p-4 border rounded">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p>{project.description}</p>
                    <p>Status: {project.status}</p>
                    {project.score && <p>Score: {project.score}</p>}

                    {role === "employee" && project.status === "Pending" && (
                      <Button className="bg-green-600" onClick={() => handleAccept(project._id)}>
                        Accept
                      </Button>
                    )}

                    {role === "employee" && project.status === "In Progress" && (
                      <Button className="bg-blue-600" >
                        {
                          UserID == project.assignedTo ?
                            <span onClick={() => handleComplete(project._id)}>
                              Mark as Completed
                            </span>
                            : "Already Accepted"
                        }
                      </Button>
                    )}

                    {role === "manager" && project.status === "Completed" && (
                      <div>
                        <label htmlFor={`score-${project._id}`} className="block font-semibold">
                          Score:
                        </label>
                        <div className="flex">

                          <input
                            id={`score-${project._id}`}
                            type="number"
                            className="p-2 border rounded w-24"
                          />
                          <Button onClick={(e) => handleScore(project._id, document.getElementById(`score-${project._id}`).value)}>Save</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
        }
      </div>
    </div>
  );
}

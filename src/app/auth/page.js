'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function SignUpSignIn() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
    });
    const [activeTab, setActiveTab] = useState("sign-up");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const endpoint = activeTab === "sign-up" ? "/api/signup" : "/api/signin";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess(result.msg);
                if (activeTab === "sign-in") {
                    router.push("/"); // Redirect to the homepage
                }
            } else {
                setError(result.msg);
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tabs
            defaultValue="sign-up"
            className="w-[400px] m-auto"
            onValueChange={(value) => {
                setActiveTab(value);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "employee",
                }); // Reset form on tab change
                setError("");
                setSuccess("");
            }}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            </TabsList>

            {/* Sign Up Tab */}
            <TabsContent value="sign-up">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Enter your details here to create an account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="role">Role</Label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full"
                                disabled={loading}
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                    </CardFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                </Card>
            </TabsContent>

            {/* Sign In Tab */}
            <TabsContent value="sign-in">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your details to log in.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </CardFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                </Card>
            </TabsContent>
        </Tabs>
    );
}

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, MessageSquare, Bot, Mic, MicOff, Volume2, VolumeX, Smile } from "lucide-react";
import Layout from "@/components/Layout";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { tts } from "@/utils/textToSpeech";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm your AI fitness buddy. Ask me anything about workouts, nutrition, or your fitness journey! 💪",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFriendlyMode, setIsFriendlyMode] = useState(true);
  const [isSpeechOutputEnabled, setIsSpeechOutputEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, startListening, stopListening, isSupported: voiceSupported } = useVoiceInput(
    (text) => {
      setInput(text);
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (input.length > 5000) {
      toast.error("Message is too long. Please keep it under 5000 characters.");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please log in to use the AI coach");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: "user", content: userMessage },
            ],
            friendlyMode: isFriendlyMode,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (response.status === 402) {
          toast.error("AI credits depleted. Please add credits to continue.");
        } else {
          toast.error("Failed to get response from AI coach");
        }
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      if (!reader) {
        throw new Error("No reader available");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Speak the response if speech output is enabled
      if (isSpeechOutputEnabled && assistantContent) {
        const cleanText = assistantContent.replace(/[*#_~`]/g, "").slice(0, 300);
        tts.speak(cleanText, "high");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error communicating with AI coach:", error);
      toast.error("Failed to connect to AI coach");
      setIsLoading(false);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            AI Fitness Coach
          </h1>
          <p className="text-muted-foreground">Get personalized fitness advice and support</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="friendly-mode"
              checked={isFriendlyMode}
              onCheckedChange={setIsFriendlyMode}
            />
            <Label htmlFor="friendly-mode" className="flex items-center gap-1 text-sm cursor-pointer">
              <Smile className="h-4 w-4" />
              Friendly Mode
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="speech-output"
              checked={isSpeechOutputEnabled}
              onCheckedChange={(checked) => {
                setIsSpeechOutputEnabled(checked);
                if (!checked) tts.stop();
              }}
            />
            <Label htmlFor="speech-output" className="flex items-center gap-1 text-sm cursor-pointer">
              {isSpeechOutputEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Voice Output
            </Label>
          </div>
        </div>

        <Card className="h-[calc(100vh-340px)] flex flex-col">
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5" />
              Chat with your AI Coach
              {isFriendlyMode && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  😊 Friendly
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === "assistant" && (
                      <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 animate-pulse" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about workouts, nutrition, or your progress..."}
              disabled={isLoading}
              className="flex-1"
            />
            {voiceSupported && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoice}
                disabled={isLoading}
                size="icon"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AICoach;

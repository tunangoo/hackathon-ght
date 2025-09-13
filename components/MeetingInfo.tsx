"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle,
  FileText,
  Send
} from "lucide-react";

const chatMessages = [
  { id: 1, sender: "AI Assistant", message: "Welcome! I can help you understand the meeting content. What would you like to know?", time: "2:30 PM", isAI: true },
  { id: 2, sender: "You", message: "What were the main discussion points about the budget?", time: "2:32 PM", isAI: false },
  { id: 3, sender: "AI Assistant", message: "The main budget discussion covered Q4 allocation for new initiatives, with emphasis on marketing and development resources. The team agreed to review the proposal by Friday.", time: "2:33 PM", isAI: true },
  { id: 4, sender: "You", message: "Who was assigned to prepare the budget proposal?", time: "2:35 PM", isAI: false },
  { id: 5, sender: "AI Assistant", message: "John was assigned to prepare the budget proposal by Friday. This was mentioned at 12:45 PM in the meeting.", time: "2:36 PM", isAI: true }
];

export default function MeetingInfo() {
  return (
    <div className="w-80 border-l border-gray-200 h-full overflow-hidden flex flex-col">
      <Tabs defaultValue="summary" className="h-full flex flex-col">
        {/* Tab Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Meeting Information</h3>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <TabsContent value="summary" className="flex-1 flex flex-col min-h-0 m-0">
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6">
                {/* Meeting Overview */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">📹 Meeting Overview</h4>
                  <div className="text-sm text-purple-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">13:03</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">12 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium text-green-600">Recorded</span>
                    </div>
                  </div>
                </div>

                {/* Key Discussion Points */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">🎯 Key Discussion Points</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Project timeline review and adjustments for Q4 deliverables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Budget allocation strategy for new marketing initiatives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Team collaboration improvements and workflow optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Client feedback integration and response strategy</span>
                    </li>
                  </ul>
                </div>

                {/* Speaking Statistics */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">📊 Speaking Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-green-100 text-green-700 text-xs">C</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Cecile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-500">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">N</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Natura</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-500">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">B</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Bryan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-4 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-500">15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">✅ Action Items</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Prepare budget proposal</p>
                        <p className="text-xs text-gray-500">Due: Friday - <strong>John</strong></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Schedule client follow-up</p>
                        <p className="text-xs text-gray-500">Due: Next week - <strong>Sarah</strong></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Update project documentation</p>
                        <p className="text-xs text-gray-500">Due: Monday - <strong>Mike</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0">
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">AI Meeting Assistant</h4>
                  <p className="text-sm text-gray-500">Ask questions about the meeting content</p>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                      <div className={`flex gap-2 max-w-xs ${msg.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`${msg.isAI ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {msg.isAI ? 'AI' : 'Y'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`rounded-lg px-3 py-2 text-sm ${msg.isAI ? 'bg-gray-100 text-gray-900' : 'bg-purple-600 text-white'}`}>
                            <p>{msg.message}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${msg.isAI ? 'text-left' : 'text-right'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about the meeting..." 
                  className="flex-1 text-sm"
                />
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

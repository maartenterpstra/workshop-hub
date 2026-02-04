import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, CheckCircle2, AlertCircle, FileAudio } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { scientificSchedule } from "@/data/scheduleScientific";
import { educationalSchedule } from "@/data/scheduleEducational";

const SpeakerUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // --- SELECTION STATE ---
  const [track, setTrack] = useState<"educational" | "scientific" | "">("");
  
  // Educational State
  const [selectedEduIndex, setSelectedEduIndex] = useState<string>(""); // We store the index as string

  // Scientific State
  const [selectedSciSessionIndex, setSelectedSciSessionIndex] = useState<string>("");
  const [selectedSciPresentationIndex, setSelectedSciPresentationIndex] = useState<string>("");
  
  const [file, setFile] = useState<File | null>(null);

  // --- DERIVED DATA (Helpers) ---
  
  // Filter Educational schedule to only show "sessions" (skip breaks)
  // We attach the 'original index' to help us map back to the data
  const eduOptions = useMemo(() => {
    let counter = 0;
    return educationalSchedule
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(item => item.type === 'session')
      .map(item => {
        counter++;
        return { ...item, displayIndex: counter };
      });
  }, []);

  // Filter Scientific schedule to only show sessions with presentations
  const sciOptions = useMemo(() => {
    let counter = 0;
    return scientificSchedule
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(item => item.type === 'session' && item.presentations && item.presentations.length > 0)
      .map(item => {
        counter++;
        return { ...item, displayIndex: counter };
      });
  }, []);

  // Get the currently selected Scientific Session object
  const currentSciSession = useMemo(() => {
    if (!selectedSciSessionIndex) return null;
    return sciOptions.find(s => s.originalIndex.toString() === selectedSciSessionIndex);
  }, [selectedSciSessionIndex, sciOptions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !track) {
      setStatus({ type: 'error', message: "Please complete the selection." });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setStatus({ type: null, message: '' });

    // CONFIG
    const CHUNK_SIZE = 2 * 1024 * 1024; 
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = Date.now().toString();

    try {
      // PREPARE METADATA
      const formDataBase = new FormData();
      formDataBase.append('track', track);
      formDataBase.append('fileId', fileId);
      formDataBase.append('originalName', file.name);
      formDataBase.append('totalChunks', totalChunks.toString());

      if (track === 'educational') {
        const session = eduOptions.find(s => s.originalIndex.toString() === selectedEduIndex);
        if (!session) throw new Error("Invalid session selected");
        
        formDataBase.append('sessionIndex', session.displayIndex.toString());
        formDataBase.append('speakerName', session.speaker || "Unknown");
        formDataBase.append('title', session.title);
      } 
      else if (track === 'scientific') {
        if (!currentSciSession) throw new Error("Invalid session");
        
        // Find presentation
        const presIndex = parseInt(selectedSciPresentationIndex);
        const presentation = currentSciSession.presentations?.[presIndex];
        if (!presentation) throw new Error("Invalid presentation selected");

        formDataBase.append('sessionIndex', currentSciSession.displayIndex.toString()); // e.g. "1" for Session 1
        formDataBase.append('sessionTitle', currentSciSession.title); // e.g. "Session 1: Image Synthesis..."
        formDataBase.append('presentationIndex', (presIndex + 1).toString()); // 1-based index
        formDataBase.append('presenterName', presentation.presenter);
        formDataBase.append('presentationTitle', presentation.title);
      }

      // CHUNK UPLOAD LOOP
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Create a new FormData for this specific chunk request
        const fd = new FormData();
        // Copy base fields
        for (const [key, value] of formDataBase.entries()) {
            fd.append(key, value);
        }
        // Add chunk specific fields
        fd.append('audioChunk', chunk);
        fd.append('chunkIndex', chunkIndex.toString());

        const response = await fetch('upload.php', { method: 'POST', body: fd });
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Server Error");
        
        setUploadProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
      }

      setStatus({ type: 'success', message: 'Upload complete! Thank you.' });
      setFile(null);
      setUploadProgress(0);
      
      // Reset logic
      const fileInput = document.getElementById('audio-upload') as HTMLInputElement;
      if(fileInput) fileInput.value = ""; 

    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: `Upload failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Presentation Upload</h1>
          <p className="text-xl text-muted-foreground">Upload your slides for {siteConfig.title}</p>
        </div>

        {status.type === 'success' && (
          <Alert className="mb-8 border-green-500/50 bg-green-500/10 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="font-semibold">{status.message}</AlertDescription>
          </Alert>
        )}
        {status.type === 'error' && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UploadCloud className="h-5 w-5 text-primary" />
              Upload Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-card rounded-lg p-2 sm:p-4 space-y-6">
              
              {/* 1. Track Selection */}
              <div className="space-y-2">
                <Label>Select Track</Label>
                <Select onValueChange={(val: any) => { setTrack(val); setFile(null); }} value={track}>
                  <SelectTrigger><SelectValue placeholder="Choose track..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational Session</SelectItem>
                    <SelectItem value="scientific">Scientific Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2a. Educational Logic */}
              {track === 'educational' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Which session are you presenting?</Label>
                  <Select onValueChange={setSelectedEduIndex} value={selectedEduIndex}>
                    <SelectTrigger><SelectValue placeholder="Select your session..." /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {eduOptions.map((item) => (
                        <SelectItem key={item.originalIndex} value={item.originalIndex.toString()}>
                          <span className="font-semibold text-primary mr-2">
                             {item.time.split(' ')[0]}
                          </span>
                          {item.speaker} - {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 2b. Scientific Logic */}
              {track === 'scientific' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  
                  {/* Supersession Selector */}
                  <div className="space-y-2">
                    <Label>Select Scientific Session</Label>
                    <Select onValueChange={(val) => { setSelectedSciSessionIndex(val); setSelectedSciPresentationIndex(""); }} value={selectedSciSessionIndex}>
                      <SelectTrigger><SelectValue placeholder="Select session..." /></SelectTrigger>
                      <SelectContent>
                        {sciOptions.map((item) => (
                          <SelectItem key={item.originalIndex} value={item.originalIndex.toString()}>
                            {item.title} ({item.time})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Presentation Selector (Only appears after session selected) */}
                  {currentSciSession && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <Label>Select Your Presentation</Label>
                      <Select onValueChange={setSelectedSciPresentationIndex} value={selectedSciPresentationIndex}>
                        <SelectTrigger><SelectValue placeholder="Find your name/title..." /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {currentSciSession.presentations?.map((pres, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                              <span className="font-semibold text-primary mr-2">{pres.time}</span>
                              {pres.presenter}: {pres.title.substring(0, 50)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* 3. File Upload (Only shows when data is fully selected) */}
              {((track === 'educational' && selectedEduIndex) || 
                (track === 'scientific' && selectedSciPresentationIndex)) && (
                <div className="space-y-2 animate-in fade-in zoom-in-95">
                  <Label htmlFor="audio-upload">File Attachment</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                    <input 
                      type="file" 
                      id="audio-upload" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".ppt,.pptx,.pdf,.mp3,.mp4"
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {file ? file.name : "Click to select file"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PPTX, PDF, or Media"}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Progress */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <Button onClick={handleSubmit} type="submit" className="w-full" disabled={isLoading || !file} size="lg">
                {isLoading ? "Processing..." : "Submit Upload"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeakerUpload;
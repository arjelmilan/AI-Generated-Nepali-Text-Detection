# Frontend-Backend Integration Sequence Diagram

The following Mermaid sequence diagram illustrates the communication flow directly from the perspective of the API service layer, browser session storage, and how results are consumed to seamlessly interact with the backend.

```mermaid
sequenceDiagram
    participant U as User
    participant API as API Service
    participant B as FastAPI Backend
    participant SS as sessionStorage
    participant RP as ResultsPage
    participant Comp as Result Components

    U->>API: Submits text for analysis
    
    activate API
    API->>B: POST /analyze
    
    Note over B: Backend Processing:<br/>Model Inference<br/>Tokenization<br/>SHAP Analysis
    
    alt Successful Analysis
        B-->>API: 200 OK (JSON Response)
        Note left of B: Returns prediction and analytics
        API->>SS: Saves parsed result to sessionStorage
        API->>U: Triggers navigation to /results
    else Error from Server
        B-->>API: Error Response
        API-->>U: Throws Error / Displays message
    end
    deactivate API

    Note over U, Comp: Context switches to Results Page

    activate RP
    RP->>SS: Reads nepdetect_last_result
    SS-->>RP: Returns raw JSON string
    
    alt Valid Result Data Found
        RP->>RP: Parses JSON and sets state
        
        RP->>Comp: Passes specific metric data via props
        
        Note over RP, Comp: Sub-Components Rendered
        Comp-->>U: ResultsGauge Component
        Comp-->>U: HeatmapVisualization Component
        Comp-->>U: Certainty Cards Component
        Comp-->>U: MetricsCards Component
    else Missing or Corrupted Data
        RP->>RP: Catch JSON parse error
        RP->>U: Redirects to /analyze
        deactivate RP
    end
```

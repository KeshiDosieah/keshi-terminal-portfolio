import bloodCellDataImage from './intelligent-blood-cell-classification-through-computer-vision-and-deep-learning/blood-cell-data.png?url';
import bloodCellResultsImage from './intelligent-blood-cell-classification-through-computer-vision-and-deep-learning/blood-cell-results.png?url';
import depressionDashboardImage from './uncertainty-aware-depression-decision-support/dashboard.png?url';
import depressionOverviewImage from './uncertainty-aware-depression-decision-support/system-overview.png?url';
import depressionPipelineImage from './uncertainty-aware-depression-decision-support/agent-pipeline.png?url';
import newcastleDashboardImage from "./real-time-analytics-&-anomaly-detection-for-newcastle's-urban-sensor-network/air-quality-dashboard.png?url";
import newcastlePipelineImage from "./real-time-analytics-&-anomaly-detection-for-newcastle's-urban-sensor-network/sensor-pipeline.png?url";

type ProjectImage = {
  src: string;
  label: string;
};

const projectImageCaptions: Record<string, ProjectImage[]> = {
  'uncertainty-aware-depression-decision-support': [
    {
      src: depressionDashboardImage,
      label: 'Real-time clinician dashboard showing biosignal inputs, multi-agent reasoning, and safety-verified treatment plans.',
    },
    {
      src: depressionOverviewImage,
      label: 'The big picture: how multimodal deep learning feeds stateful AI agents to turn raw biosignals into safe patient care.',
    },
    {
      src: depressionPipelineImage,
      label: 'Behind the scenes of the agentic pipeline: how nodes, routing checks, and safety loops process patient context in real time.',
    },
  ],
  'intelligent-blood-cell-classification-through-computer-vision-and-deep-learning': [
    {
      src: bloodCellDataImage,
      label: 'Explored the eight blood cell categories, checked image quality, and addressed duplicates and potential data leakage. The result: 17,062 cleaned images ready for training.',
    },
    {
      src: bloodCellResultsImage,
      label: 'Started with a baseline MLP and explored class weighting, feature engineering, and ensemble methods before moving to a CNN. The experiments brought test accuracy from 78.10% to 94.05%.',
    },
  ],
  "real-time-analytics-&-anomaly-detection-for-newcastle's-urban-sensor-network": [
    {
      src: newcastleDashboardImage,
      label: 'A live look at Newcastle air quality, sensor readings, and real-time pollution anomaly detection.',
    },
    {
      src: newcastlePipelineImage,
      label: "Newcastle's live sensor data transformed through Spark, Medallion Architecture, anomaly detection, and real-time alerts.",
    },
  ],
};

export default projectImageCaptions;

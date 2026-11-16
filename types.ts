
export type PoseCategory = 'Lying' | 'Sitting' | 'Standing' | 'Inverted' | 'Dynamic';

export interface Pose {
  id: string;
  name: string;
  description: string;
  category: PoseCategory;
  imageUrl: string; // Silhouette placeholder
}

export interface AppState {
  selectedPose: Pose | null;
  userImage: string | null;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
}

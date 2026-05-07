import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  ChevronLeft, 
  LogOut, 
  Settings, 
  Activity, 
  Calendar, 
  CreditCard,
  Video,
  Play,
  ClipboardList,
  Utensils,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  X,
  Dumbbell,
  CheckCircle2,
  Target,
  Plus,
  Trash2,
  Save,
  Clock,
  ChevronUp,
  ChevronDown,
  Info,
  Timer
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, adminCreateUser } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

type ViewMode = 'login' | 'dashboard' | 'workouts' | 'diets' | 'progress' | 'videos' | 'calendar' | 'mount-workout' | 'do-workout' | 'admin-pupils' | 'admin-view-pupil' | 'admin-add-pupil';

const WHATSAPP_NUMBER = "5598970031298";
const AUTHORIZED_ADMIN_EMAIL = "personalvinicius@gmail.com";

const EXERCISE_LIBRARY: Record<string, string[]> = {
  PEITO: ["Supino reto", "Supino inclinado", "Crucifixo", "Peck deck", "Flexão"],
  COSTAS: ["Puxada frontal", "Remada baixa", "Remada curvada", "Pulldown", "Barra fixa"],
  OMBRO: ["Desenvolvimento", "Elevação lateral", "Elevação frontal", "Arnold press"],
  BÍCEPS: ["Rosca direta", "Rosca martelo", "Rosca concentrada"],
  TRÍCEPS: ["Tríceps pulley", "Tríceps francês", "Tríceps banco"],
  PERNAS: ["Agachamento", "Leg press", "Extensora", "Flexora", "Afundo", "Panturrilha"],
  ABDÔMEN: ["Prancha", "Abdominal reto", "Abdominal infra", "Bicicleta"],
  CARDIO: ["Esteira", "Bicicleta", "Corrida", "HIIT"]
};

const ELITE_PROTOCOL_A: Exercise[] = [
  { id: 'ea1', name: "Supino Inclinado c/ Halteres", category: "PEITO", sets: 4, reps: "10-12", weight: "0", rest: "60", notes: "Foco na parte superior do peito" },
  { id: 'ea2', name: "Supino Reto na Máquina", category: "PEITO", sets: 4, reps: "10-12", weight: "0", rest: "60", notes: "Controle a negativa" },
  { id: 'ea3', name: "Crucifixo Reto c/ Halteres", category: "PEITO", sets: 3, reps: "12", weight: "0", rest: "45", notes: "Alongamento máximo" },
  { id: 'ea4', name: "Voador (Peck Deck)", category: "PEITO", sets: 3, reps: "15", weight: "0", rest: "45", notes: "Pico de contração" },
  { id: 'ea5', name: "Tríceps Pulley Barra", category: "TRÍCEPS", sets: 4, reps: "12", weight: "0", rest: "45", notes: "Cotovelos fechados" },
  { id: 'ea6', name: "Tríceps Testa c/ Halteres", category: "TRÍCEPS", sets: 3, reps: "10", weight: "0", rest: "60", notes: "Cuidado com a articulação" },
  { id: 'ea7', name: "Tríceps Corda", category: "TRÍCEPS", sets: 3, reps: "15", weight: "0", rest: "45", notes: "Abra a corda no final" },
];

const ELITE_PROTOCOL_B: Exercise[] = [
  { id: 'eb1', name: "Puxada Frontal Aberta", category: "COSTAS", sets: 4, reps: "10-12", weight: "0", rest: "60", notes: "Puxe com os cotovelos" },
  { id: 'eb2', name: "Remada Baixa Triângulo", category: "COSTAS", sets: 4, reps: "12", weight: "0", rest: "60", notes: "Tronco estável" },
  { id: 'eb3', name: "Remada Curvada Supinada", category: "COSTAS", sets: 3, reps: "10", weight: "0", rest: "60", notes: "Foco na espessura" },
  { id: 'eb4', name: "Pulldown com Corda", category: "COSTAS", sets: 3, reps: "15", weight: "0", rest: "45", notes: "Braços semi-esticados" },
  { id: 'eb5', name: "Rosca Direta Barra W", category: "BÍCEPS", sets: 4, reps: "10", weight: "0", rest: "60", notes: "Sem balanço" },
  { id: 'eb6', name: "Rosca Martelo Halteres", category: "BÍCEPS", sets: 3, reps: "12", weight: "0", rest: "45", notes: "Pegada neutra" },
  { id: 'eb7', name: "Rosca Concentrada", category: "BÍCEPS", sets: 3, reps: "15", weight: "0", rest: "45", notes: "Total isolamento" },
];

const ELITE_PROTOCOL_C: Exercise[] = [
  { id: 'ec1', name: "Agachamento Smith/Livre", category: "PERNAS", sets: 4, reps: "10", weight: "0", rest: "90", notes: "Amplitude máxima" },
  { id: 'ec2', name: "Leg Press 45º", category: "PERNAS", sets: 4, reps: "12", weight: "0", rest: "90", notes: "Pés na largura dos ombros" },
  { id: 'ec3', name: "Cadeira Extensora", category: "PERNAS", sets: 4, reps: "15", weight: "0", rest: "60", notes: "Pico de contração de 2s" },
  { id: 'ec4', name: "Mesa Flexora", category: "PERNAS", sets: 4, reps: "12", weight: "0", rest: "60", notes: "Pelve colada no banco" },
  { id: 'ec5', name: "Afundo / Passada", category: "PERNAS", sets: 3, reps: "10 (Lado)", weight: "0", rest: "60", notes: "Passo largo" },
  { id: 'ec6', name: "Panturrilha em Pé", category: "PERNAS", sets: 4, reps: "15", weight: "0", rest: "45", notes: "Fase excêntrica lenta" },
];

const ELITE_PROTOCOL_D: Exercise[] = [
  { id: 'ed1', name: "Desenvolvimento Halteres", category: "OMBRO", sets: 4, reps: "10", weight: "0", rest: "60", notes: "Empurre para cima" },
  { id: 'ed2', name: "Elevação Lateral", category: "OMBRO", sets: 4, reps: "12", weight: "0", rest: "45", notes: "Até a linha do ombro" },
  { id: 'ed3', name: "Elevação Frontal Anilha", category: "OMBRO", sets: 3, reps: "12", weight: "0", rest: "45", notes: "Elevação controlada" },
  { id: 'ed4', name: "Encolhimento Halteres", category: "OMBRO", sets: 4, reps: "15", weight: "0", rest: "45", notes: "Trapezius focus" },
  { id: 'ed5', name: "Abdominal Infra Solo", category: "ABDÔMEN", sets: 4, reps: "15", weight: "0", rest: "45", notes: "Lenta descida" },
  { id: 'ed6', name: "Abdominal Supra Solo", category: "ABDÔMEN", sets: 4, reps: "20", weight: "0", rest: "45", notes: "Contração máxima" },
];

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  weight: string;
  rest: string;
  notes: string;
  completed?: boolean;
}

interface Workout {
  id: string;
  title: string;
  division?: string;
  exercises: Exercise[];
  createdAt: any;
  updatedAt: any;
  status: string;
}

export default function StudentArea({ onClose, initialView }: { onClose: () => void, initialView?: ViewMode }) {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const [view, setView] = useState<ViewMode>(initialView || (user ? 'dashboard' : 'login'));

  useEffect(() => {
    if (user && view === 'login') {
      setView('dashboard');
    }
  }, [user]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // Data states
  const [dataReady, setDataReady] = useState({
    workouts: false,
    diets: false,
    progress: false,
    videos: false
  });
  
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [pupils, setPupils] = useState<any[]>([]);
  const [selectedPupil, setSelectedPupil] = useState<any>(null);
  const [pupilWorkouts, setPupilWorkouts] = useState<any[]>([]);

  // Workout creation state
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDivision, setWorkoutDivision] = useState('Geral');
  const [workoutGoal, setWorkoutGoal] = useState('Hipertrofia');
  const [workoutExperience, setWorkoutExperience] = useState('Iniciante');
  const [workoutFrequency, setWorkoutFrequency] = useState(3);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [editingWeight, setEditingWeight] = useState<{ workoutId: string, exerciseId: string, value: string } | null>(null);

  const updateExerciseResult = async (workoutId: string, exerciseId: string, field: string, value: any) => {
    const targetUser = selectedPupil || user;
    if (!targetUser) return;

    const workout = (selectedPupil ? pupilWorkouts : workouts).find(w => w.id === workoutId);
    if (!workout) return;

    const updatedExercises = workout.exercises.map((ex: Exercise) => 
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    );

    const workoutPath = `users/${targetUser.uid || targetUser.id}/workouts/${workoutId}`;
    try {
      await setDoc(doc(db, workoutPath), { 
        exercises: updatedExercises,
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, workoutPath);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer]);

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsTimerActive(true);
  };

  useEffect(() => {
    if (user) {
      setIsDataLoading(true);
      // Workouts
      const workoutsPath = `users/${user.uid}/workouts`;
      const workoutsRef = collection(db, workoutsPath);
      const qWorkouts = query(workoutsRef, orderBy('createdAt', 'desc'));
      const unsubWorkouts = onSnapshot(qWorkouts, (snapshot) => {
        setWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataReady(prev => ({ ...prev, workouts: true }));
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, workoutsPath);
        setDataReady(prev => ({ ...prev, workouts: true }));
      });

      // Diets
      const dietsPath = `users/${user.uid}/diets`;
      const dietsRef = collection(db, dietsPath);
      const qDiets = query(dietsRef, orderBy('createdAt', 'desc'));
      const unsubDiets = onSnapshot(qDiets, (snapshot) => {
        setDiets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataReady(prev => ({ ...prev, diets: true }));
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, dietsPath);
        setDataReady(prev => ({ ...prev, diets: true }));
      });

      // Progress
      const progressPath = `users/${user.uid}/progress`;
      const progressRef = collection(db, progressPath);
      const qProgress = query(progressRef, orderBy('date', 'desc'));
      const unsubProgress = onSnapshot(qProgress, (snapshot) => {
        setProgress(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataReady(prev => ({ ...prev, progress: true }));
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, progressPath);
        setDataReady(prev => ({ ...prev, progress: true }));
      });

      // Videos
      const videosPath = 'videos';
      const videosRef = collection(db, videosPath);
      const unsubVideos = onSnapshot(videosRef, (snapshot) => {
        setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDataReady(prev => ({ ...prev, videos: true }));
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, videosPath);
        setDataReady(prev => ({ ...prev, videos: true }));
      });

      return () => {
        unsubWorkouts();
        unsubDiets();
        unsubProgress();
        unsubVideos();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user?.email === AUTHORIZED_ADMIN_EMAIL && (view === 'admin-pupils' || view === 'dashboard')) {
      const usersRef = collection(db, 'users');
      const unsubUsers = onSnapshot(usersRef, (snapshot) => {
        setPupils(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));
      return () => unsubUsers();
    }
  }, [user, view]);

  useEffect(() => {
    if (selectedPupil && view === 'admin-view-pupil') {
      const workoutsPath = `users/${selectedPupil.uid}/workouts`;
      const workoutsRef = collection(db, workoutsPath);
      const q = query(workoutsRef, orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        setPupilWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, workoutsPath));
      return () => unsub();
    }
  }, [selectedPupil, view]);

  useEffect(() => {
    // If all essential data listeners have responded (even if empty)
    if (dataReady.workouts && dataReady.diets && dataReady.progress && dataReady.videos) {
      setIsDataLoading(false);
    }
  }, [dataReady]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      // Tenta login padrão
      await signInWithEmailAndPassword(auth, email, password);
      setView('dashboard');
    } catch (err: any) {
      // Se for o e-mail oficial do Admin e não existir, cria automaticamente
      if (email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: 'Marcos Vinicius' });
          setView('dashboard');
          return;
        } catch (regErr: any) {
          // Se já existir mas a senha estiver errada, ou outro erro
          if (regErr.code === 'auth/email-already-in-use') {
            setError('E-mail ou senha inválidos.');
          } else {
            setError('Erro ao validar acesso. Tente novamente.');
          }
          return;
        }
      }
      
      setError('E-mail ou senha inválidos. Acesso exclusivo para alunos autorizados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPupil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Preencha os dados do novo aluno.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const newUser = await adminCreateUser(email, password, name);
      
      // Initialize profile in Firestore
      const userRef = doc(db, 'users', newUser.uid);
      await setDoc(userRef, {
        uid: newUser.uid,
        email: email,
        displayName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: 'pupil'
      });

      setName('');
      setEmail('');
      setPassword('');
      setView('admin-pupils');
    } catch (err: any) {
      console.error('Error creating pupil:', err);
      setError('Erro ao criar aluno. Verifique se o e-mail já existe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePupil = async (pupilId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno? Todos os dados serão perdidos.')) return;
    
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'users', pupilId));
      setSelectedPupil(null);
      setView('admin-pupils');
    } catch (err: any) {
      console.error('Error deleting pupil:', err);
      setError('Erro ao excluir aluno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePupilField = async (pupilId: string, field: string, value: any) => {
    try {
      await setDoc(doc(db, 'users', pupilId), { [field]: value }, { merge: true });
    } catch (err: any) {
      console.error('Error updating pupil:', err);
    }
  };

  const handleCreateWorkout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUser = selectedPupil || user;
    if (!targetUser) return;
    
    if (selectedExercises.length === 0) {
      setError('Adicione pelo menos um exercício ao treino.');
      return;
    }

    setIsSubmitting(true);
    const workoutsPath = `users/${targetUser.uid || targetUser.id}/workouts`;
    try {
      const workoutsRef = collection(db, workoutsPath);
      
      const workoutData = {
        title: workoutTitle || `Treino ${workoutGoal}`,
        division: workoutDivision,
        goal: workoutGoal,
        experience: workoutExperience,
        frequency: workoutFrequency,
        exercises: selectedExercises,
        updatedAt: serverTimestamp(),
        status: 'active'
      };

      if (editingWorkoutId) {
        // We'll use a specific ID if we had it, but for now just adding works
        await addDoc(workoutsRef, { ...workoutData, createdAt: serverTimestamp() });
      } else {
        await addDoc(workoutsRef, { ...workoutData, createdAt: serverTimestamp() });
      }
      
      if (selectedPupil) {
        setView('admin-view-pupil');
      } else {
        setView('workouts');
      }
      setSelectedExercises([]);
      setWorkoutTitle('');
      setEditingWorkoutId(null);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, workoutsPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExerciseToPlan = (name: string, category: string) => {
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      category,
      sets: 3,
      reps: '12',
      weight: '0',
      rest: '60',
      notes: ''
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExerciseFromPlan = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const updateExerciseInPlan = (id: string, field: keyof Exercise, value: any) => {
    setSelectedExercises(selectedExercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  if (authLoading) return null;

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full shadow-glow-blue"
      />
      <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Carregando seus dados...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-brand-dark border border-white/10 rounded-[2.5rem] p-8 relative z-[101] overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-6"
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-4">E-mail do Aluno</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@aluno.com"
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-blue/30 focus:bg-brand-blue/5 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-4">Senha de Acesso</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-blue/30 focus:bg-brand-blue/5 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
                  >
                    <p className="text-red-400 text-[10px] text-center font-bold tracking-wider uppercase">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,240,255,0.2)] glow-blue disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 rotate-180" />
                      Entrar no Portal
                    </>
                  )}
                </motion.button>
              </form>

              <div className="pt-4 flex flex-col items-center gap-4">
                <div className="h-[1px] w-12 bg-white/5" />
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá Marcos! Desejo me tornar seu aluno e ter acesso à plataforma exclusiva.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-brand-blue/40 hover:text-brand-blue uppercase tracking-[0.2em] transition-colors"
                >
                  Deseja ser aluno? Clique aqui
                </a>
              </div>
            </motion.div>
          )}


          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-neon-gradient p-[2px] shadow-lg glow-blue group overflow-hidden relative">
                    <div className="w-full h-full rounded-2xl bg-brand-dark flex items-center justify-center border border-white/10 overflow-hidden">
                      {user?.email === AUTHORIZED_ADMIN_EMAIL || userProfile?.photoURL ? (
                        <img 
                          src={userProfile?.photoURL || "https://lh3.googleusercontent.com/d/1BxpKNGytewZt0036i8tEqbhw6WIzcNzH"} 
                          className="w-full h-full object-cover p-1" 
                          alt="Profile"
                        />
                      ) : (
                        <User className="w-6 h-6 text-brand-blue" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight text-lg leading-none">
                      {user?.email === AUTHORIZED_ADMIN_EMAIL ? 'MARCOS VINICIUS' : (userProfile?.displayName ? `OLÁ, ${userProfile.displayName.split(' ')[0]}` : 'CARREGANDO...')}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">SESSÃO ATIVA • {user?.email === AUTHORIZED_ADMIN_EMAIL ? 'PREMIUM ADMIN' : 'ALUNO VIP'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={signOut}
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('workouts')}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center p-1.5 group-hover:glow-blue transition-all">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1BxpKNGytewZt0036i8tEqbhw6WIzcNzH" 
                      alt="Personal Logo" 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">MINHA FICHA</p>
                    <p className="text-white font-black text-sm uppercase">TREINO ELITE</p>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('diets')}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">DIETAS</p>
                    <p className="text-white font-black text-sm uppercase">PLANO ALIMENTAR</p>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('progress')}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue-deep/20 flex items-center justify-center text-white group-hover:shadow-[0_0_15px_rgba(0,71,255,0.4)] transition-all">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">EVOLUÇÃO</p>
                    <p className="text-white font-black text-sm uppercase">MINHAS METAS</p>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('videos')}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-white group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">VÍDEOS</p>
                    <p className="text-white font-black text-sm uppercase">CONTEÚDO VIP</p>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('calendar')}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">AGENDA</p>
                    <p className="text-white font-black text-sm uppercase">VER DATAS</p>
                  </div>
                </motion.button>

                <motion.a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 text-left group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue group-hover:glow-blue transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">SUPORTE</p>
                    <p className="text-white font-black text-sm uppercase">WHATSAPP</p>
                  </div>
                </motion.a>

                {user?.email === AUTHORIZED_ADMIN_EMAIL && (
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0,240,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setView('admin-pupils')}
                    className="bg-brand-blue/10 border border-brand-blue/30 rounded-3xl p-6 space-y-3 text-left group col-span-2 mt-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue group-hover:glow-blue transition-all">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">PAINEL ADMIN</p>
                      <p className="text-white font-black text-sm uppercase">GERENCIAR {pupils.length} ALUNOS</p>
                    </div>
                  </motion.button>
                )}
              </div>

              {workouts.length > 0 && workouts[0].status === 'active' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-blue/10 border border-brand-blue/20 rounded-3xl p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-brand-blue font-black tracking-widest text-[10px] uppercase">TREINO ATIVO</h4>
                      <p className="text-white font-bold text-xs uppercase tracking-wider">{workouts[0].title || "Custom Pack"}</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                  </div>
                </motion.div>
              )}

              {workouts.length === 0 && user?.email === AUTHORIZED_ADMIN_EMAIL && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setView('mount-workout')}
                  className="bg-brand-blue/10 border border-brand-blue/20 rounded-3xl p-6 flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-1">
                    <h4 className="text-brand-blue font-black tracking-widest text-[10px] uppercase">BEM-VINDO</h4>
                    <p className="text-white font-bold text-xs uppercase tracking-wider">SOLICITE SEU PRIMEIRO TREINO</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand-blue group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </motion.div>
          )}

          {view === 'workouts' && (
            <motion.div
              key="workouts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('dashboard')} 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">Minhas Fichas</h3>
                    <p className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em]">SISTEMA ELITE DIGITAL</p>
                  </div>
                </div>
                {user?.email === AUTHORIZED_ADMIN_EMAIL && (
                  <button 
                    onClick={() => setView('mount-workout')}
                    className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue hover:glow-blue transition-all"
                    title="Novo Treino"
                  >
                    <Dumbbell className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {isDataLoading ? renderLoading() : workouts.length > 0 ? workouts.map((w, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-brand-dark-alt border border-white/5 rounded-[2.5rem] p-6 hover:border-brand-blue/30 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center p-3 group-hover:bg-brand-blue/5 transition-all shadow-glow-blue/20">
                          <img 
                            src="https://lh3.googleusercontent.com/d/1BxpKNGytewZt0036i8tEqbhw6WIzcNzH" 
                            alt="Personal Logo" 
                            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-brand-blue uppercase tracking-[0.3em]">PLANILHA PREMIUM</p>
                          <h4 className="text-white font-black text-lg uppercase tracking-tight leading-none">{w.title || `FICHA ${i + 1}`}</h4>
                          <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1 text-white/30 text-[9px] font-bold uppercase">
                               <Calendar className="w-3 h-3" />
                               {w.createdAt ? new Date(w.createdAt?.toDate()).toLocaleDateString('pt-BR') : 'Nov/2026'}
                             </div>
                             <div className="w-1 h-1 rounded-full bg-white/10" />
                             <div className="flex items-center gap-1 text-white/30 text-[9px] font-bold uppercase">
                               <Dumbbell className="w-3 h-3" />
                               {w.exercises?.length || 0} EXERCÍCIOS
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setActiveWorkout(w);
                          setView('do-workout');
                        }}
                        className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-all"
                      >
                        <Play className="w-5 h-5 fill-current ml-1" />
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem] space-y-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-white/10" />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase text-sm tracking-widest mb-2">Ficha não liberada</p>
                      <p className="text-white/30 text-[10px] uppercase font-bold px-12">Sua planilha personalizada está sendo preparada pelo Marcos Vinicius.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'diets' && (
            <motion.div
              key="diets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">NUTRIÇÃO</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">PROTOCOLOS ALIMENTARES</p>
                </div>
              </div>

              <div className="space-y-4">
                {isDataLoading ? renderLoading() : diets.length > 0 ? diets.map((d, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/[0.08] transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-white font-black text-sm uppercase">{d.title || "Plano de Transição"}</h4>
                        <p className="text-white/30 text-[10px] font-bold uppercase">{new Date(d.createdAt?.toDate()).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <button className="text-brand-blue">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )) : (
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center mx-auto">
                      <Utensils className="w-8 h-8 text-emerald-500/20" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-black text-xs uppercase tracking-widest">PLANO EM PREPARAÇÃO</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">SEU PROTOCOLO ESTÁ SENDO MONTADO PELO NUTRICIONISTA PARCEIRO.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">EVOLUÇÃO</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">MÉTRICAS FÍSICAS</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {isDataLoading ? renderLoading() : progress.length > 0 ? progress.map((p, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex justify-between items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <p className="text-white/30 text-[10px] font-black uppercase mb-1">{new Date(p.date?.toDate()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                      <p className="text-brand-blue font-black text-3xl leading-none flex items-baseline gap-1">
                        {p.weight}
                        <span className="text-sm">kg</span>
                      </p>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                        <Activity className="w-3 h-3 text-brand-blue" />
                        <p className="text-white font-black text-sm">{p.bodyFat}% <span className="text-[10px] opacity-40">BF</span></p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center">
                    <TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-6" />
                    <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                      NENHUM CHECK-IN REALIZADO.<br/>FAÇA SUA PRIMEIRA AVALIAÇÃO.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">CONTEÚDO VIP</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">VÍDEOS E TUTORIAIS</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {isDataLoading ? renderLoading() : videos.length > 0 ? videos.map((v, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer"
                  >
                    <div className="aspect-video bg-white/5 flex items-center justify-center relative overflow-hidden">
                      <img 
                        src={v.thumbnail || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"} 
                        alt={v.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                      />
                      <div className="w-14 h-14 rounded-full bg-brand-blue/90 text-white flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform glow-blue">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-10">
                        <span className="text-white font-black text-[9px] uppercase tracking-widest">{v.duration || "08:45"}</span>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-white font-black text-sm uppercase tracking-tight">{v.title}</h4>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{v.category}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-brand-blue transition-colors" />
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center">
                    <Video className="w-12 h-12 text-white/10 mx-auto mb-6" />
                    <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.3em]">
                      GALERIA EXCLUSIVA EM BREVE.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('dashboard')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
                <h3 className="text-xl font-black uppercase text-white tracking-widest">AGENDA</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-white/40">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Agenda de treinos presenciais e lives em breve.</p>
              </div>
            </motion.div>
          )}

          {view === 'mount-workout' && (
            <motion.div
              key="mount-workout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('workouts')}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">MONTAR TREINO</h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">PERSONALIZE SUA FICHA</p>
                  </div>
                </div>
                <button 
                  onClick={handleCreateWorkout}
                  disabled={isSubmitting || selectedExercises.length === 0}
                  className="bg-brand-blue text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg glow-blue disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  SALVAR
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <input 
                    type="text" 
                    placeholder="NOME DO TREINO (EX: TREINO A - PEITO)"
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    className="w-full bg-transparent text-white font-black uppercase placeholder:text-white/20 focus:outline-none"
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => {
                        setWorkoutTitle("TREINO A - PEITORAL / TRÍCEPS");
                        setWorkoutDivision("Treino A");
                        setSelectedExercises(ELITE_PROTOCOL_A);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[8px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-glow-blue/10"
                    >
                      Carregar Treino A
                    </button>
                    <button 
                      onClick={() => {
                        setWorkoutTitle("TREINO B - COSTAS / BÍCEPS");
                        setWorkoutDivision("Treino B");
                        setSelectedExercises(ELITE_PROTOCOL_B);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[8px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-glow-blue/10"
                    >
                      Carregar Treino B
                    </button>
                    <button 
                      onClick={() => {
                        setWorkoutTitle("TREINO C - PERNAS");
                        setWorkoutDivision("Treino C");
                        setSelectedExercises(ELITE_PROTOCOL_C);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[8px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-glow-blue/10"
                    >
                      Carregar Treino C
                    </button>
                    <button 
                      onClick={() => {
                        setWorkoutTitle("TREINO D - OMBROS / ABS");
                        setWorkoutDivision("Treino D");
                        setSelectedExercises(ELITE_PROTOCOL_D);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[8px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all shadow-glow-blue/10"
                    >
                      Carregar Treino D
                    </button>
                  </div>
                </div>

                <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {Object.entries(EXERCISE_LIBRARY).map(([category, exercises]) => (
                    <div key={category} className="space-y-2">
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em]">{category}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {exercises.map(ex => (
                          <button
                            key={ex}
                            onClick={() => addExerciseToPlan(ex, category)}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-all group"
                          >
                            <p className="text-white font-bold text-[9px] uppercase leading-tight group-hover:text-brand-blue">{ex}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/10 my-2" />

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">MINHA SELEÇÃO ({selectedExercises.length})</p>
                  {selectedExercises.map((ex, idx) => (
                    <motion.div 
                      key={ex.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-brand-blue/20 text-brand-blue flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                          <p className="text-white font-black text-xs uppercase">{ex.name}</p>
                        </div>
                        <button onClick={() => removeExerciseFromPlan(ex.id)} className="text-white/20 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-white/20 uppercase">SÉRIES</label>
                          <input 
                            type="number" 
                            value={ex.sets}
                            onChange={(e) => updateExerciseInPlan(ex.id, 'sets', parseInt(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-1 text-white font-black text-[9px] focus:border-brand-blue/50 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-white/20 uppercase">REPS</label>
                          <input 
                            type="text" 
                            value={ex.reps}
                            onChange={(e) => updateExerciseInPlan(ex.id, 'reps', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-1 text-white font-black text-[9px] focus:border-brand-blue/50 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-white/20 uppercase">CARGA</label>
                          <input 
                            type="text" 
                            value={ex.weight}
                            onChange={(e) => updateExerciseInPlan(ex.id, 'weight', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-1 text-white font-black text-[9px] focus:border-brand-blue/50 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-white/20 uppercase">DESC (S)</label>
                          <input 
                            type="text" 
                            value={ex.rest}
                            onChange={(e) => updateExerciseInPlan(ex.id, 'rest', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-1 text-white font-black text-[9px] focus:border-brand-blue/50 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-white/20 uppercase">INFO</label>
                          <button 
                            onClick={() => {
                              const notes = prompt('Observações para este exercício:', ex.notes);
                              if (notes !== null) updateExerciseInPlan(ex.id, 'notes', notes);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1 flex items-center justify-center text-white/30 hover:text-white"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'do-workout' && activeWorkout && (
            <motion.div
              key="do-workout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('workouts')}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">{activeWorkout.title}</h2>
                    <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                       Sessão em Andamento
                    </p>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isTimerActive && (
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="bg-brand-blue text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-glow-blue border border-white/20"
                    >
                      <Timer className="w-4 h-4 animate-bounce" />
                      <span className="font-mono font-black text-xs">{restTimer}s</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Summary */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Ficha Digital Premium</p>
                     <p className="text-white font-black text-lg uppercase tracking-tight">
                       Sessão: {activeWorkout.division || 'Treino do Dia'}
                     </p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[8px] font-black text-brand-blue uppercase tracking-widest">PROGRESSO</p>
                        <p className="text-white font-black text-sm uppercase">{Math.round(((activeWorkout.exercises?.filter((ex: any) => ex.completed).length || 0) / (activeWorkout.exercises?.length || 1)) * 100)}%</p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center relative bg-brand-blue/5">
                        <svg className="w-full h-full -rotate-90">
                          <circle 
                            cx="28" cy="28" r="24" 
                            fill="transparent" 
                            stroke="rgba(0,240,255,0.05)" 
                            strokeWidth="3"
                          />
                          <circle 
                            cx="28" cy="28" r="24" 
                            fill="transparent" 
                            stroke="#00F0FF" 
                            strokeWidth="3"
                            strokeDasharray={150.8}
                            strokeDashoffset={150.8 - (150.8 * (activeWorkout.exercises?.filter((ex: any) => ex.completed).length || 0) / (activeWorkout.exercises?.length || 1))}
                            className="transition-all duration-700"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Activity className="w-5 h-5 text-brand-blue opacity-50" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Tabela de Exercícios */}
              <div className="px-8 hidden md:flex items-center justify-between text-white/20 font-black text-[8px] uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-2">
                <span className="w-1/2">Exercício / Prescrição</span>
                <div className="flex gap-12 pr-12">
                  <span>Séries</span>
                  <span>Reps</span>
                  <span>Carga</span>
                </div>
              </div>
 
               <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {activeWorkout.exercises?.map((ex: Exercise, idx: number) => (
                  <motion.div 
                    key={ex.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "group bg-brand-dark-alt border border-white/5 rounded-[2.5rem] p-6 transition-all relative overflow-hidden",
                      ex.completed && "opacity-50 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] bg-emerald-500/5"
                    )}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                           <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-glow-blue/10",
                             ex.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/20 group-hover:bg-brand-blue/20 group-hover:text-brand-blue"
                           )}>
                             {idx + 1}
                           </div>
                           <div>
                             <h4 className="text-white font-black text-lg uppercase tracking-tight leading-none mb-1">{ex.name}</h4>
                             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{ex.category || 'EXERCÍCIO'}</p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
                            <p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">SÉRI</p>
                            <p className="text-white font-black text-sm">{ex.sets}X</p>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
                            <p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">REPS</p>
                            <p className="text-white font-black text-sm">{ex.reps}</p>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 col-span-2 relative group-focus-within:border-brand-blue/30">
                            <p className="text-[7px] font-black text-brand-blue/60 uppercase tracking-widest leading-none">CARGA (KG)</p>
                            <input 
                              type="text"
                              value={editingWeight?.exerciseId === ex.id ? editingWeight.value : (ex.weight || '0')}
                              onFocus={() => setEditingWeight({ workoutId: activeWorkout.id, exerciseId: ex.id, value: ex.weight || '0' })}
                              onChange={(e) => setEditingWeight({ ...editingWeight!, value: e.target.value })}
                              onBlur={() => {
                                if (editingWeight) {
                                  updateExerciseResult(activeWorkout.id, ex.id, 'weight', editingWeight.value);
                                  setEditingWeight(null);
                                }
                              }}
                              className="w-full bg-transparent text-white font-black text-base text-center focus:outline-none transition-all selection:bg-brand-blue/30"
                            />
                            <div className="absolute bottom-1 right-2">
                               <Settings className="w-2 h-2 text-white/10" />
                            </div>
                          </div>
                        </div>

                        {ex.notes && (
                           <div className="flex items-start gap-3 bg-brand-blue/5 rounded-2xl p-4 border border-brand-blue/10">
                             <div className="mt-0.5">
                                <Info className="w-4 h-4 text-brand-blue" />
                             </div>
                             <p className="text-[10px] font-bold text-white/50 leading-relaxed uppercase tracking-tight">{ex.notes}</p>
                           </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 justify-center items-center">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const updated = activeWorkout.exercises.map((e: any) => 
                              e.id === ex.id ? { ...e, completed: !e.completed } : e
                            );
                            setActiveWorkout({ ...activeWorkout, exercises: updated });
                            updateExerciseResult(activeWorkout.id, ex.id, 'completed', !ex.completed);
                            if (!ex.completed) startRestTimer(parseInt(ex.rest) || 60);
                          }}
                          className={cn(
                            "w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all border-2",
                            ex.completed 
                              ? "bg-emerald-500 border-emerald-400 text-white shadow-glow-emerald" 
                              : "bg-white/5 border-white/10 text-white/10 hover:text-brand-blue hover:border-brand-blue/50"
                          )}
                        >
                          <CheckCircle2 className={cn("w-8 h-8", ex.completed && "animate-pulse")} />
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startRestTimer(parseInt(ex.rest) || 60)}
                          className="w-16 h-10 rounded-[1.25rem] bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all gap-2"
                        >
                          <Timer className="w-4 h-4" />
                          <span className="text-[10px] font-black">{ex.rest}s</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('workouts')}
                className="w-full bg-brand-blue text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-glow-blue text-sm relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse" />
                CONCLUIR TREINAMENTO
              </motion.button>
            </motion.div>
          )}

          {view === 'admin-pupils' && (
            <motion.div
              key="admin-pupils"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('dashboard')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">ALUNOS</h3>
                    <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest">GERENCIAMENTO GERAL</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView('admin-add-pupil')}
                  className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue hover:glow-blue transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {pupils.map((pupil) => (
                  <button
                    key={pupil.id}
                    onClick={() => {
                      setSelectedPupil(pupil);
                      setView('admin-view-pupil');
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between hover:bg-white/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-black text-sm uppercase">{pupil.displayName || 'Aluno sem nome'}</p>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-tight">{pupil.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'admin-add-pupil' && (
            <motion.div
              key="admin-add-pupil"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('admin-pupils')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">NOVO ALUNO</h3>
                  <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest">CRIAR ACESSO PRIVADO</p>
                </div>
              </div>

              <form onSubmit={handleAddPupil} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-4">NOME DO ALUNO</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Nome Completo"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-blue/50 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-4">E-MAIL (LOGIN)</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="email@aluno.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-blue/50 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-4">SENHA INICIAL</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-blue/50 transition-all"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs text-center font-bold tracking-wide uppercase bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-neon-gradient text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-blue/20 glow-blue disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      CADASTRAR ALUNO
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {view === 'admin-view-pupil' && selectedPupil && (
            <motion.div
              key="admin-view-pupil"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('admin-pupils')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none">{selectedPupil.displayName?.split(' ')[0]}</h3>
                    <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest">GERENCIAMENTO DO ALUNO</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePupil(selectedPupil.uid)}
                  className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button 
                  onClick={() => {
                    setWorkoutTitle('');
                    setSelectedExercises([]);
                    setView('mount-workout');
                  }}
                  className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-4 flex items-center gap-3 text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase">NOVO TREINO</span>
                </button>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <Activity className="w-4 h-4 text-brand-blue" />
                  <span className="text-[10px] font-black text-white/40 uppercase">ALUNO ATIVO</span>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-2">PLANILHAS DE TREINO ({pupilWorkouts.length})</p>
                {pupilWorkouts.map((w) => (
                  <div key={w.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-black text-sm uppercase">{w.title}</p>
                        <p className="text-white/30 text-[10px] font-bold uppercase">{w.exercises?.length || 0} EXERCÍCIOS</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={() => {
                            setEditingWorkoutId(w.id); // Note: this logic might need user-switching but for V1 it's okay
                            setWorkoutTitle(w.title || '');
                            setSelectedExercises(w.exercises || []);
                            // Switching user context for saving would be needed for full admin-edit-as-user
                            // For now, let's just allow viewing
                            setView('mount-workout');
                          }}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-white flex items-center justify-center transition-all"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                       {w.exercises?.slice(0, 3).map((ex: any, idx: number) => (
                         <div key={idx} className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase px-3 py-2 bg-black/20 rounded-xl">
                            <span>{ex.name}</span>
                            <span className="text-brand-blue">{ex.sets}x{ex.reps}</span>
                         </div>
                       ))}
                       {w.exercises?.length > 3 && (
                         <p className="text-[8px] text-center text-white/20 font-black">+ {w.exercises.length - 3} OUTROS EXERCÍCIOS</p>
                       )}
                    </div>
                  </div>
                ))}
                {pupilWorkouts.length === 0 && (
                  <p className="text-center py-10 text-white/20 text-[10px] font-black uppercase tracking-widest">Nenhuma planilha encontrada.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

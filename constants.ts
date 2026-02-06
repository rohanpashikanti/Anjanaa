import { Task, Reward, TaskCategory } from './types';
import { BookOpen, Home, Heart, Palette, Moon, CheckCircle, Brain, Zap } from 'lucide-react';

export const AVATARS = [
  // Boys
  { id: 'boy1', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg', name: 'Boy 1', gender: 'boy' },
  { id: 'boy2', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg', name: 'Boy 2', gender: 'boy' },
  { id: 'boy3', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg', name: 'Boy 3', gender: 'boy' },
  { id: 'boy4', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671140.jpg', name: 'Boy 4', gender: 'boy' },
  // Girls
  { id: 'girl1', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671118.jpg', name: 'Girl 1', gender: 'girl' },
  { id: 'girl2', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671132.jpg', name: 'Girl 2', gender: 'girl' },
  { id: 'girl3', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671126.jpg', name: 'Girl 3', gender: 'girl' },
  { id: 'girl4', src: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671136.jpg', name: 'Girl 4', gender: 'girl' },
];

export const CATEGORY_CONFIG: Record<TaskCategory, { icon: any, color: string, label: string }> = {
  'Homework': { icon: BookOpen, color: 'bg-blue-100 text-blue-600', label: 'Homework' },
  'Chores': { icon: Home, color: 'bg-orange-100 text-orange-600', label: 'Chores' },
  'Physical': { icon: Heart, color: 'bg-red-100 text-red-600', label: 'Physical' },
  'Creative': { icon: Palette, color: 'bg-purple-100 text-purple-600', label: 'Creative' },
  'Quiet Time': { icon: Moon, color: 'bg-indigo-100 text-indigo-600', label: 'Quiet Time' },
  'Daily Habit': { icon: CheckCircle, color: 'bg-teal-100 text-teal-600', label: 'Daily Habit' },
  'Brain Power': { icon: Brain, color: 'bg-yellow-100 text-yellow-600', label: 'Brain Power' },
  'Zen Mode': { icon: Zap, color: 'bg-green-100 text-green-600', label: 'Zen Mode' },
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Brush Teeth',
    description: 'Morning & Night',
    category: 'Daily Habit',
    reward: 10,
    xp: 15,
    status: 'pending',
    isRecurring: true,
    createdAt: Date.now(),
    userId: 'guest'
  },
  {
    id: '2',
    title: 'Read 10m',
    description: 'Before bed',
    category: 'Homework',
    reward: 15,
    xp: 20,
    status: 'pending',
    isRecurring: true,
    createdAt: Date.now(),
    userId: 'guest'
  }
];

export const INITIAL_REWARDS: Reward[] = [];

export const BADGES = [
  { id: 'b1', threshold: 100, title: 'Little Rebel', subtitle: 'Start the journey', image: '/achievements/Little Rebel.png' },
  { id: 'b2', threshold: 250, title: 'Junior Jai Lava Kusa', subtitle: 'Balancing tasks', image: '/achievements/Junior Jai Lava Kusa.png' },
  { id: 'b3', threshold: 500, title: 'Focus Srimanthudu', subtitle: 'Wealth of focus', image: '/achievements/Focus Srimanthudu.png' },
  { id: 'b4', threshold: 1000, title: 'Gabbar Singh Speed', subtitle: 'High energy & speed', image: '/achievements/Gabbar Singh Speed.png' },
  { id: 'b5', threshold: 1750, title: 'Discipline Dhruva', subtitle: 'Logic beats distractions', image: '/achievements/Discipline Dhruva.png' },
  { id: 'b6', threshold: 2500, title: 'Thaggede Le', subtitle: 'Never give up', image: '/achievements/Thaggede Le.png' },
  { id: 'b7', threshold: 5000, title: 'Devara of Focus', subtitle: 'Master of routine', image: '/achievements/Devara of Focus.png' },
  { id: 'b8', threshold: 6000, title: 'Salaar Ceasefire', subtitle: 'Total silence in Zen', image: '/achievements/Salaar Ceasefire.png' },
  { id: 'b9', threshold: 7500, title: 'Jai Mahishmati', subtitle: 'Unbreakable streak', image: '/achievements/Jai Mahishmati.png' },
  { id: 'b10', threshold: 10000, title: 'Global Game Changer', subtitle: 'Lifestyle transformation', image: '/achievements/Global Game Changer.png' },
];
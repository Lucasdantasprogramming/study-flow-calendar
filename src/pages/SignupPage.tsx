
import { SignupForm } from "@/components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-study-purple/5 to-study-blue/5">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">StudyFlow</h1>
        <p className="text-muted-foreground">Organize seus estudos de forma eficiente</p>
      </div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

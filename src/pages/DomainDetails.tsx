import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEmails } from "../hooks/useEmails";
import {
  type ChangePasswordFormData,
  type CreateEmailFormData,
  changePasswordSchema,
  createEmailSchema,
} from "../schemas/email";
import { emailService } from "../services/emailService";

export const DomainDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const { data: emails, isLoading, isError } = useEmails(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmailFormData>({
    resolver: zodResolver(createEmailSchema),
    defaultValues: { storage: 1024 },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEmailFormData) =>
      emailService.createEmail(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Conta criada com sucesso!");
      closeModal();
    },
    onError: () => toast.error("Erro ao criar a conta."),
  });

  const deleteMutation = useMutation({
    mutationFn: (emailId: string) => emailService.deleteEmail(id!, emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Conta removida com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir a conta."),
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (emailId: string) =>
      emailService.toggleBlockStatus(id!, emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Status atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });

  const updateStorageMutation = useMutation({
    mutationFn: ({ emailId, storage }: { emailId: string; storage: number }) =>
      emailService.updateStorage(id!, emailId, storage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Armazenamento atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar armazenamento."),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      emailService.updatePassword(id!, selectedEmailId!, data),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      closePasswordModal();
    },
    onError: () => toast.error("Erro ao alterar senha."),
  });

  const onSubmit = (data: CreateEmailFormData) => createMutation.mutate(data);
  const onPasswordSubmit = (data: ChangePasswordFormData) =>
    changePasswordMutation.mutate(data);

  const handleDelete = (emailId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta conta?")) {
      deleteMutation.mutate(emailId);
    }
  };

  const handleUpdateStorage = (emailId: string, currentStorage: number) => {
    const newStorageStr = window.prompt(
      "Novo limite (MB):",
      currentStorage.toString(),
    );
    if (newStorageStr !== null) {
      const newStorage = Number(newStorageStr);
      if (!isNaN(newStorage) && newStorage > 0) {
        updateStorageMutation.mutate({ emailId, storage: newStorage });
      } else {
        toast.error("Insira um valor válido maior que zero.");
      }
    }
  };

  const openPasswordModal = (emailId: string) => {
    setSelectedEmailId(emailId);
    setIsPasswordModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    passwordForm.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate("/domains")}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-2 flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar para Domínios
            </button>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Contas de E-mail
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nova Conta
          </button>
        </div>

        {/* Estados de Loading e Erro */}
        {isLoading && (
          <div className="animate-pulse bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
        
        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-100 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            Erro ao carregar as contas de e-mail.
          </div>
        )}

        {/* Lista de E-mails */}
        {!isLoading && !isError && emails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {emails.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma conta encontrada</h3>
                <p className="text-gray-500 max-w-sm">Crie a primeira conta de e-mail para este domínio clicando no botão acima.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {emails.map((account) => (
                  <div
                    key={account.id}
                    className="p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between hover:bg-gray-50/80 transition-colors duration-200 group"
                  >
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {account.email}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase ${account.isBlocked ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
                        >
                          {account.isBlocked ? "Bloqueado" : "Ativo"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        Storage: <span className="font-medium text-gray-700">{account.storage} MB</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => handleUpdateStorage(account.id, account.storage)}
                        className="flex-1 lg:flex-none justify-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
                      >
                        Storage
                      </button>
                      <button
                        onClick={() => openPasswordModal(account.id)}
                        className="flex-1 lg:flex-none justify-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
                      >
                        Senha
                      </button>
                      <button
                        onClick={() => toggleBlockMutation.mutate(account.id)}
                        className={`flex-1 lg:flex-none justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${account.isBlocked ? "text-green-700 border-green-200 bg-green-50 hover:bg-green-100 focus:ring-2 focus:ring-green-100" : "text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100 focus:ring-2 focus:ring-orange-100"}`}
                      >
                        {account.isBlocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="flex-1 lg:flex-none justify-center px-4 py-2 text-sm font-medium border border-red-200 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Criar Conta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Conta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="nome@dominio.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Mínimo de 6 caracteres"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Storage (MB)</label>
                <input
                  type="number"
                  {...register("storage", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Ex: 1024"
                />
                {errors.storage && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.storage.message}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md disabled:opacity-50 transition-all duration-200"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alterar Senha */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alterar Senha</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nova Senha</label>
                <input
                  type="password"
                  {...passwordForm.register("password")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1.5 font-medium">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md disabled:opacity-50 transition-all duration-200"
                >
                  {changePasswordMutation.isPending ? "Salvando..." : "Salvar Nova Senha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
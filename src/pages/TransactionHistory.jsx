import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBalance(data.balance || 0);

          // Get transaction history (for now just the last transaction)
          if (data.lastTransaction) {
            setTransactions([data.lastTransaction]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft size={18} />
              <span>العودة</span>
            </button>

            <h1 className="text-xl font-bold text-gray-800">تاريخ المعاملات</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-lg mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 mb-2">الرصيد الحالي</p>
              <h2 className="text-4xl font-bold">{balance.toFixed(2)} ر.س</h2>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign size={40} />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4" dir="rtl">
            آخر المعاملات
          </h3>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              جاري التحميل...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500" dir="rtl">
              لا توجد معاملات بعد
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                  dir="rtl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {transaction.type === "research_generation"
                          ? "إنشاء بحث"
                          : transaction.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.tokens} رمز (Token)
                      </p>
                      {transaction.timestamp && (
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.timestamp).toLocaleString(
                            "ar-SA"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-red-600">
                      -{transaction.cost.toFixed(4)} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            dir="rtl"
          >
            <p className="text-sm text-blue-800">
              💡 <strong>ملاحظة:</strong> يتم حساب التكلفة بناءً على عدد الرموز
              (Tokens) المستخدمة في كل عملية. التكلفة: 0.001 ريال لكل 1000 رمز.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

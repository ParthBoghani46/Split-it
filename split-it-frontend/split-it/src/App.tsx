import "./App.css";

import GroupFormPage from "./pages/GrouFormpage";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import TestPage from "./pages/TestPage";
import GroupExpensesPage from "./pages/GroupExpensesPage";
import ExpenseFormPage from "./pages/ExpenseFormPage";
import { RecentGroupListPage } from "./pages/RecentGroupListPage";
import GroupPage from "./pages/GroupPage";
import GroupBalancesPage from "./pages/GroupBalancesPage";
import GroupStatePage from "./pages/GroupStatePage";
import GroupEditPage from "./pages/GroupEditPage";
import GroupExpenseEditPage from "./pages/GroupExpenseEditPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/groups" element={<RecentGroupListPage />} />
        <Route path="/groups/create" element={<GroupFormPage />} />
        <Route path="groups/:groupId" element={<GroupPageWrapper />} />
        <Route path="groups/:groupId/expenses/export/json"></Route>
        <Route
          path="groups/:groupId/expenses"
          element={<GroupExpensePageWrapper />}
        />
        <Route
          path="groups/:groupId/analysis"
          element={<GroupExpenseTestPageWrapper />}
        />
        <Route
          path="groups/:groupId/expenses/:expenseId/edit"
          element={<GroupExpenseEditPageWrapper />}
        />
        <Route
          path="groups/:groupId/expenses/create"
          element={<ExpensePageWrapper />}
        />
        <Route
          path="groups/:groupId/balances"
          element={<BalancesPageWrapper />}
        />
        <Route
          path="groups/:groupId/stats"
          element={<GroupStatePageWrapper />}
        />
        <Route path="groups/:groupId/edit" element={<GroupEditPageWrapper />} />
      </Routes>
    </Router>
  );
}

function ExpensePageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "";
  return <ExpenseFormPage groupId={groupId} />;
}
function GroupStatePageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "";
  return <GroupStatePage groupId={groupId} />;
}

function GroupExpensePageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "";
  const props = { params: { groupId: groupId } };
  return <GroupExpensesPage {...props} />;
}

function GroupExpenseTestPageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "";
  const props = { params: { groupId: groupId } };
  return <TestPage {...props} />;
}

function GroupPageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "";
  const props = { params: { groupId: groupId } };
  return <GroupPage {...props} />;
}
function BalancesPageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "Xt0JIw_cs2cHs-Z0KO-YC";
  const props = { params: { groupId: groupId } };
  return <GroupBalancesPage {...props} />;
}
function GroupEditPageWrapper() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId || "Xt0JIw_cs2cHs-Z0KO-YC";
  const props = { params: { groupId: groupId } };
  return <GroupEditPage {...props} />;
}

function GroupExpenseEditPageWrapper() {
  const { groupId, expenseId } = useParams<{
    groupId?: string;
    expenseId?: string;
  }>();

  // Set default values if parameters are not provided
  const defaultGroupId = "Xt0JIw_cs2cHs-Z0KO-YC";
  const defaultExpenseId = "defaultExpenseId"; // Provide a default expenseId if needed

  // Use the extracted groupId and expenseId in the props
  const props = {
    params: {
      groupId: groupId || defaultGroupId,
      expenseId: expenseId || defaultExpenseId,
    },
  };
  return <GroupExpenseEditPage {...props} />;
}
export default App;
